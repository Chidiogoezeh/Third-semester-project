import { TicketService } from "../../src/modules/tickets/ticket.service";

describe("Ticket Service", () => {
  const service =
    new TicketService();

  it("should create instance", () => {
    expect(service).toBeDefined();
  });
});