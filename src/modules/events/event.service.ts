import { EventRepository } from "./event.repository";

import { generateSlug } from "../../shared/utils/slug";

import { ForbiddenError } from "../../shared/errors/forbidden";
import { NotFoundError } from "../../shared/errors/notFound";

import {
  CreateEventDto,
  UpdateEventDto
} from "./event.validation";

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

  async getEvents(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return repository.findAll(skip, limit);
  }

  async getEvent(slug: string) {
    const event =
      await repository.findBySlug(slug);

    if (!event) {
      throw new NotFoundError(
        "Event not found"
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

    return repository.update(
      eventId,
      {
        ...data,
        eventDate: data.eventDate
          ? new Date(data.eventDate)
          : undefined
      }
    );
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

    await repository.delete(eventId);

    return null;
  }
}