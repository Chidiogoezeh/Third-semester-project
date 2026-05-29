import { Request, Response } from "express";

import { TicketService } from "./ticket.service";

import { successResponse } from "../../shared/utils/response";

const service = new TicketService();

export class TicketController {
  book = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.bookTicket(
        req.params.id,
        req.user!.userId
      );

    return successResponse(
      res,
      "Ticket booked",
      result,
      201
    );
  };

  verify = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.verifyTicket(
        req.body.ticketToken
      );

    return successResponse(
      res,
      "Ticket verified",
      result
    );
  };
}