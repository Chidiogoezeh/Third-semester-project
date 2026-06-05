import { EventService } from "../../src/modules/events/event.service";

describe("Event Service", () => {
  const service =
    new EventService();

  it("should create instance", () => {
    expect(service).toBeDefined();
  });
});