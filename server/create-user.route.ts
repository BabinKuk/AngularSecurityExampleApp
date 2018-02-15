import { Request, Response } from 'express';
import { db } from './database';
import { USERS } from './database-data';

export function createUser(req: Request, res: Response) {

  console.log('createUser ', req.body);
  // init request data
  const credentials = req.body;
  // store new user in db
  const user = db.createUser(credentials.email, credentials.password);
  console.log(USERS);

  // response with status and user object
  res.status(200).json({
    id: user.id,
    email: user.email
  });
}
