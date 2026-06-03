import { prisma }
  from "../../config/database";

import { ForbiddenError }
  from "../../shared/errors/forbidden";

import { ReminderTemplateRepository }
  from "./reminderTemplate.repository";

import { NotFoundError }
  from "../../shared/errors/notFound";

const repository =
  new ReminderTemplateRepository();

export class ReminderTemplateService {
  async createTemplate(data: {
    eventId: string;
    creatorId: string;
    reminderOffset: number;
  }) {
    const event =
      await prisma.event.findUnique({
        where: {
          id: data.eventId
        }
      });

    if (!event) {
      throw new NotFoundError(
        "Event not found"
      );
    }

    if (event.creatorId !== data.creatorId) {
      throw new ForbiddenError(
        "You do not own this event"
      );
    }

    return repository.create(data);
  }

  async getTemplates(
    eventId: string
  ) {
    return repository.findByEvent(
      eventId
    );
  }

  async deleteTemplate(
    templateId: string,
    creatorId: string
    ) {
    const template =
        await prisma.eventReminderTemplate.findUnique({
        where: {
            id: templateId
        },
        include: {
            event: true
        }
        });

    if (!template) {
        throw new NotFoundError(
        "Reminder template not found"
        );
    }

    if (
        template.event.creatorId !==
        creatorId
    ) {
        throw new ForbiddenError(
        "You do not own this event"
        );
    }

    return repository.delete(
        templateId
    );
    }
}