export class ReminderWorker {
  async processReminder(data: {
    email: string;
    eventTitle: string;
  }) {
    console.log(
      `Reminder sent to ${data.email} for ${data.eventTitle}`
    );
  }
}