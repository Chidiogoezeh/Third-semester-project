import { ReminderRepository } from "./reminder.repository";

const repository =
  new ReminderRepository();

export class ReminderService {
  async createReminder(data: {
    eventId: string;
    userId: string;
    reminderOffset: number;
  }) {
    return repository.create(data);
  }
}