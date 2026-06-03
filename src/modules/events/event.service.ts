import { EventRepository } from "./event.repository";

import { generateSlug } from "../../shared/utils/slug";

import { ForbiddenError } from "../../shared/errors/forbidden";
import { NotFoundError } from "../../shared/errors/notFound";

import { CreateEventDto, UpdateEventDto } from "./event.validation";

import { redis } from "../../config/redis";

import { Prisma } from "@prisma/client";

const repository = new EventRepository();

export class EventService {
  async createEvent(
    creatorId: string,
    data: CreateEventDto
  ) {
    let slug =
      generateSlug(data.title);

    const existing =
      await repository.findByTitleSlug(
        slug
      );

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    return repository.create({
      ...data,
      slug,
      eventDate: new Date(data.eventDate),
      creator: {
        connect: {
          id: creatorId
        }
      }
    });
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
      await repository.findAll(
        skip,
        limit,
        search
      );

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
      await repository.findBySlug(slug);

    if (!event) {
      throw new NotFoundError(
        "Event not found"
      );
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
    return repository.findCreatorEvents(creatorId);
  }

  async getEventAttendees(
    eventId: string,
    creatorId: string
  ) {
    const event =
      await repository.findById(eventId);

    if (!event) {
      throw new NotFoundError(
        "Event not found"
      );
    }

    if (
      event.creatorId !== creatorId
    ) {
      throw new ForbiddenError(
        "Not your event"
      );
    }

    const attendees =
      await repository.findEventAttendees(
        eventId
      );

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
      await repository.findById(eventId);

    if (!event) {
      throw new NotFoundError(
        "Event not found"
      );
    }

    if (
      event.creatorId !== creatorId
    ) {
      throw new ForbiddenError(
        "Not your event"
      );
    }

    const updated =
      await repository.update(
        eventId,
        {
          ...data,
          eventDate: data.eventDate
            ? new Date(data.eventDate)
            : undefined
        }
      );

    if (redis) {
      await redis.del(
        `event:${event.slug}`
      );
    }

    return updated;
  }

  async deleteEvent(
    eventId: string,
    creatorId: string
  ) {
    const event =
      await repository.findById(eventId);

    if (!event) {
      throw new NotFoundError(
        "Event not found"
      );
    }

    if (
      event.creatorId !== creatorId
    ) {
      throw new ForbiddenError(
        "Not your event"
      );
    }

    if (redis) {
      await redis.del(
        `event:${event.slug}`
      );
    }

    await repository.delete(eventId);

    return null;
  }
}