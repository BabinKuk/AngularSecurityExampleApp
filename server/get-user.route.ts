import {Request, Response} from 'express';
import { sessionStore } from './session-store';

export function getUser(req: Request, res: Response) {
  // fetch session id from request
  const sessionId = req.cookies['SESSIONID'];
  // fetch user data corresponding to session id
  const user = sessionStore.findUserBySessionId(sessionId);

  // response
  if (user) {
    res.status(200).json(user);
  } else {
    res.sendStatus(204); // no content
  }

}
