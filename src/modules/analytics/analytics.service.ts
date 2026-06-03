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

    const revenue =
      await repository.getSuccessfulRevenue(
        creatorId
      );

    const ticketsSold = events.reduce(
      (acc, event) =>
        acc + event.tickets.length,
      0
    );

    const attendance = events.reduce(
      (acc, event) =>
        acc +
        event.tickets.filter(
          ticket => ticket.isScanned
        ).length,
      0
    );

    const scanRate =
      ticketsSold === 0
        ? 0
        : (attendance /
            ticketsSold) *
          100;

    const eventAnalytics =
      events.map(event => {
        const eventTickets =
          event.tickets.length;

        const scannedTickets =
          event.tickets.filter(
            ticket => ticket.isScanned
          ).length;

        const eventRevenue =
          event.payments.reduce(
            (sum, payment) =>
              sum + payment.amount,
            0
          );

        return {
          title: event.title,
          revenue: eventRevenue,
          ticketsSold: eventTickets,
          attendanceRate:
            eventTickets === 0
              ? 0
              : (scannedTickets /
                  eventTickets) *
                100
        };
      });

    return {
      revenue,
      ticketsSold,
      attendance,
      scanRate,

      revenuePerEvent:
        events.length === 0
          ? 0
          : revenue / events.length,

      ticketsPerEvent:
        events.length === 0
          ? 0
          : ticketsSold /
            events.length,

      events: eventAnalytics
    };
  }
}