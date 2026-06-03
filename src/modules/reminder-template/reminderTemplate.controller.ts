import { Request, Response } from "express";
import { ReminderTemplateService } from "./reminderTemplate.service";
import { successResponse } from "../../shared/utils/response";

const service = new ReminderTemplateService();

export class ReminderTemplateController {
  create = async (
    req: Request,
    res: Response
  ) => {
    const eventId = req.params.id;

    if (Array.isArray(eventId)) {
    throw new Error("Invalid event id");
    }

    const template =
    await service.createTemplate({
        eventId,
        creatorId: req.user!.userId,
        reminderOffset:
          req.body.reminderOffset
      });

    return successResponse(
      res,
      "Reminder template created",
      template,
      201
    );
  };

  list = async (
    req: Request,
    res: Response
  ) => {
    const eventId = req.params.id;

    if (Array.isArray(eventId)) {
    throw new Error("Invalid event id");
    }

    const templates =
    await service.getTemplates(
        eventId
    );

    return successResponse(
    res,
    "Templates retrieved",
    templates
    );
  };

  delete = async (
    req: Request,
    res: Response
  ) => {
    const templateId =
  req.params.templateId;

if (Array.isArray(templateId)) {
  throw new Error(
    "Invalid template id"
  );
}

await service.deleteTemplate(
  templateId,
  req.user!.userId
);

    return successResponse(
      res,
      "Template deleted"
    );
  };
}