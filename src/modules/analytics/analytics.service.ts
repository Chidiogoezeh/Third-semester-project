import { AnalyticsRepository } from "./analytics.repository";

const repository =
  new AnalyticsRepository();

export class AnalyticsService {
  async getDashboard(
    creatorId: string
  ) {
    const events =
      await repository.getCreatorEvents(
        creatorId
      );

    const ticketsSold = events.reduce(
      (acc, event) =>
        acc + event.tickets.length,
      0
    );

    const revenue = events.reduce(
      (acc, event) =>
        acc +
        event.tickets.length *
          event.price,
      0
    );

    const scannedTickets = events.reduce(
      (acc, event) =>
        acc +
        event.tickets.filter(
          (ticket) =>
            ticket.isScanned
        ).length,
      0
    );

    return {
      revenue,
      ticketsSold,
      scannedTickets,
      attendanceRate:
        ticketsSold === 0
          ? 0
          : (scannedTickets /
              ticketsSold) *
            100
    };
  }
}