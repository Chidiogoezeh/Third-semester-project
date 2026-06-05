import { Request, Response } from "express";
import { TicketService } from "./ticket.service";
import { successResponse } from "../../shared/utils/response";

const service = new TicketService();

export class TicketController {

  myTickets = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.getUserTickets(
        req.user!.userId
      );

    return successResponse(
      res,
      "Tickets fetched successfully",
      result
    );
  };

  verify = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.verifyTicket(
        req.body.ticketToken,
        req.user!.userId
      );

    return successResponse(
      res,
      "Ticket verified successfully",
      result
    );
  };
}