import { prisma } from "../../config/database";

export class EventRepository {
  async create(data: any) {
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

  async findCreatorEvents(creatorId: string) {
    return prisma.event.findMany({
      where: {
        creatorId
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
}