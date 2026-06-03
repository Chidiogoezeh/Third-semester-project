import { Request, Response } from "express";

import { EventService } from "./event.service";

import { successResponse } from "../../shared/utils/response";

const service = new EventService();

export class EventController {
  create = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.createEvent(
        req.user!.userId,
        req.body
      );

    return successResponse(
      res,
      "Event created",
      result,
      201
    );
  };

  getAll = async (
    req: Request,
    res: Response
  ) => {
    const page = Math.max(
      1,
      Number(req.query.page) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number(req.query.limit) || 10
      )
    );

    const search = String(
      req.query.search || ""
    );

    const result =
      await service.getEvents(
        page,
        limit,
        search
      );

    return successResponse(
      res,
      "Events fetched",
      result
    );
  };

  getOne = async (
    req: Request<{ slug: string }>,
    res: Response
  ) => {
    const result =
      await service.getEvent(
        req.params.slug
      );

    return successResponse(
      res,
      "Event fetched",
      result
    );
  };

  creatorEvents = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.getCreatorEvents(
        req.user!.userId
      );

    return successResponse(
      res,
      "Creator events fetched",
      result
    );
  };

  attendees = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    const result =
      await service.getEventAttendees(
        req.params.id,
        req.user!.userId
      );

    return successResponse(
      res,
      "Attendees fetched",
      result
    );
  };

  update = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    const result =
      await service.updateEvent(
        req.params.id,
        req.user!.userId,
        req.body
      );

    return successResponse(
      res,
      "Event updated",
      result
    );
  };
  delete = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    await service.deleteEvent(
      req.params.id,
      req.user!.userId
    );

    return successResponse(
      res,
      "Event deleted"
    );
  };

}