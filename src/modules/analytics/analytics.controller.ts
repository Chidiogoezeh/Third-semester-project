import { Request, Response } from "express";

import { AnalyticsService } from "./analytics.service";

import { successResponse } from "../../shared/utils/response";

const service =
  new AnalyticsService();

export class AnalyticsController {
  dashboard = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await service.getDashboard(
        req.user!.userId
      );

    return successResponse(
      res,
      "Analytics fetched",
      result
    );
  };
}