export type CreateEventInput = {
  title: string;
  description: string;
  location: string;
  price: number;
  capacity?: number;
  eventDate: string;
  reminderWindow?: number;
};