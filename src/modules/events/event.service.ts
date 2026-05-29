import { EventRepository } from "./event.repository";

import { generateSlug } from "../../shared/utils/slug";

const repository = new EventRepository();

export class EventService {
  async createEvent(
    creatorId: string,
    data: any
  ) {
    return repository.create({
      ...data,
      slug: generateSlug(data.title),
      creatorId,
      eventDate: new Date(data.eventDate)
    });
  }

  async getEvents(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return repository.findAll(skip, limit);
  }

  async getEvent(slug: string) {
    return repository.findBySlug(slug);
  }

  async getCreatorEvents(creatorId: string) {
    return repository.findCreatorEvents(creatorId);
  }
}