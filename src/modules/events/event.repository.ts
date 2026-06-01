import { prisma } from "../../config/database";

import {
  Prisma
} from "@prisma/client";

export class EventRepository {
  async create(
    data: Prisma.EventCreateInput
  ) {
    return prisma.event.create({
      data
    });
  }

  async findAll(skip: number, take: number) {
    return prisma.event.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findBySlug(slug: string) {
    return prisma.event.findUnique({
      where: {
        slug
      }
    });
  }

  async findByTitleSlug(
    slug: string
  ) {
    return prisma.event.findUnique({
      where: { slug }
    });
  }

  async findCreatorEvents(
    creatorId: string
  ) {
    return prisma.event.findMany({
      where: {
        creatorId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findEventAttendees(eventId: string) {
    return prisma.ticket.findMany({
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
  }

  async countTickets(eventId: string) {
    return prisma.ticket.count({
      where: {
        eventId
      }
    });
  }

  async findById(id: string) {
    return prisma.event.findUnique({
      where: {
        id
      }
    });
  }

  async update(
    id: string,
    data: Prisma.EventUpdateInput
  ) {
    return prisma.event.update({
      where: {
        id
      },
      data
    });
  }

  async delete(id: string) {
    return prisma.event.delete({
      where: {
        id
      }
    });
  }
}