import { Request, Response } from "express";

import { ReminderService } from "./reminder.service";

import { successResponse } from "../../shared/utils/response";

const service = new ReminderService();

export class ReminderController {
  create = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.createReminder({
        eventId: req.params.id,
        userId: req.user!.userId,
        reminderOffset:
          req.body.reminderOffset
      });

    return successResponse(
      res,
      "Reminder created",
      result,
      201
    );
  };
}