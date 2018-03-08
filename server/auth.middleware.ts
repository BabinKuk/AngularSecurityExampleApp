import { Request, Response, NextFunction } from "express";

export function checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
  // check if user is authenticated (userid is present in request)
  if (req['userId']) {
    next();
  } else {
    res.sendStatus(403);
  }
}
