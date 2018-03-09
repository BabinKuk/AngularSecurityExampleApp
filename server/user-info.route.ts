import { Request, Response } from "express";
import { db } from "./database";

export function userInfo(req:Request, res: Response) {
  // fetch from request
  const userInfo = req.user;
  console.log('Check if user exists', userInfo);

  // if user already exists, fetch data and send it to the client
  let user = db.findUserByEmail(userInfo.email);

  // if user does not exist, create new user with default preferences
  if (!user) {
    user = db.createUser(userInfo.email, userInfo.sub);
  }

  // send response
  res.sendStatus(200).json({email: user.email});
}
