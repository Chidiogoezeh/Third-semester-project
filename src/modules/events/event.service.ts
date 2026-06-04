import { generateSlug } from "../../shared/utils/slug";
import { AppError } from "../../shared/errors/appError";
import { CreateEventDto, UpdateEventDto } from "./event.validation";
import { redis } from "../../config/redis";
import { prisma } from "../../config/database";

export class EventService {
  private async invalidateEventCaches(
    slug?: string
  ) {
    if (!redis) return;

    if (slug) {
      await redis.del(`event:${slug}`);
    }

    const keys =
      await redis.keys("events:*");

    if (keys.length) {
      await redis.del(...keys);
    }
  }

  async createEvent(
    creatorId: string,
    data: CreateEventDto
  ) {
    let slug =
      generateSlug(data.title);

    const existing =
      await prisma.event.findUnique({
        where: { slug }
      });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const event =
      await prisma.event.create({
        data: {
          ...data,

          reminderTemplates:
            data.reminderTemplates ?? [24],

          slug,

          eventDate: new Date(
            data.eventDate
          ),

          creator: {
            connect: {
              id: creatorId
            }
          }
        }
      });

    await this.invalidateEventCaches();

    return event;
  }

  async getEvents(
    page = 1,
    limit = 10,
    search?: string
  ) {
    const cacheKey = `events:${page}:${limit}:${search ?? ""}`;

    if (redis) {
      const cached =
        await redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }
    }

    const skip = (page - 1) * limit;

    const events =
      await prisma.event.findMany({
        skip,
        take: limit,

        where: search
          ? {
              title: {
                contains: search,
                mode: "insensitive"
              }
            }
          : undefined,

        orderBy: {
          createdAt: "desc"
        }
      });

    if (redis) {
      await redis.set(
        cacheKey,
        JSON.stringify(events),
        "EX",
        300
      );
    }

    return events;
  }

  async getEvent(slug: string) {
    const cacheKey = `event:${slug}`;

    if (redis) {
      const cached =
        await redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }
    }

    const event =
      await prisma.event.findUnique({
        where: { slug }
      });

    if (!event) {
      throw AppError.notFound("User not found");
    }

    if (redis) {
      await redis.set(
        cacheKey,
        JSON.stringify(event),
        "EX",
        300
      );
    }

    return event;
  }

  async getCreatorEvents(creatorId: string) {
        return prisma.event.findMany({
      where: {
        creatorId
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async getEventAttendees(
    eventId: string,
    creatorId: string
  ) {
    const event =
      await prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

    if (!event) {
      throw AppError.notFound("User not found");
    }

    if (
      event.creatorId !== creatorId
    ) {
      throw AppError.forbidden("Access denied");
    }

    const attendees =
      await prisma.ticket.findMany({
        where: {
          eventId
        },

        include: {
          eventee: {
            select: {
              email: true
            }
          }
        }
      });

    return attendees.map(
      attendee => ({
        eventeeId:
          attendee.eventeeId,
        email:
          attendee.eventee.email,
        isScanned:
          attendee.isScanned
      })
    );
  }

  async updateEvent(
    eventId: string,
    creatorId: string,
    data: UpdateEventDto
  ) {
    const event =
      await prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

    if (!event) {
      throw AppError.notFound("User not found");
    }

    if (
      event.creatorId !== creatorId
    ) {
      throw AppError.forbidden("Access denied");
    }

    const updated =
      await prisma.event.update({
        where: {
          id: eventId
        },

        data: {
          ...data,

          eventDate: data.eventDate
            ? new Date(data.eventDate)
            : undefined
        }
      });

    await this.invalidateEventCaches(
      event.slug
    );

    return updated;
  }

  async deleteEvent(
    eventId: string,
    creatorId: string
  ) {
    const event =
      await prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

    if (!event) {
      throw AppError.notFound("User not found");
    }

    if (
      event.creatorId !== creatorId
    ) {
      throw AppError.forbidden("Access denied");
    }

    await prisma.event.delete({
      where: {
        id: eventId
      }
    });

    await this.invalidateEventCaches(
      event.slug
    );

    return null;
  }
}