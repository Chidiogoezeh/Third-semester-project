import { Request, Response } from "express";
import { ReminderService } from "./reminder.service";
import { successResponse } from "../../shared/utils/response";

const service = new ReminderService();

export class ReminderController {
  create = async (
    req: Request,
    res: Response
  ) => {
    const eventId = req.params.id;

    if (Array.isArray(eventId)) {
      throw new Error("Invalid event id");
    }

    const result = await service.createReminder({
      eventId,
      userId: req.user!.userId,
      reminderOffset: req.body.reminderOffset
    });

    return successResponse(
      res,
      "Reminder created",
      result,
      201
    );
  };
}