import { NextFunction, Request, Response } from "express-serve-static-core";
import { matchedData, validationResult } from "express-validator";

import * as db from "../database/db.js";
import { makeResObj } from "../helpers/utils.js";
import { messages } from "../helpers/messages.js";
import { JobPost } from "../helpers/types.js";

export async function createJobPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const validationError = validationResult(req).array()[0];

  if (validationError) {
    const resObj = makeResObj(validationError.msg);
    return res.status(400).json(resObj);
  }

  const validatedData = matchedData(req);
  const userId = req.sessionData!.id;
  const jobPost: JobPost = {
    clientId: userId,
    statusId: 1,
    title: validatedData.title,
    description: validatedData.description,
    budget_low: validatedData.budget_low,
    budget_high: validatedData.budget_high,
  };

  const dbResponse = db.insertJobPost(jobPost);
}
