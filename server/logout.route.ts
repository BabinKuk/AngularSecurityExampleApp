import {Request, Response} from 'express';
import { sessionStore } from './session-store';

export function logout(req: Request, res: Response) {
  console.log('logout');
  // get session id from cookies
  const sessionId = req.cookies['SESSIONID'];
  // destroy session
  sessionStore.destroySession(sessionId);
  // clear cookies and send response
  res.clearCookie('SESSIONID');
  res.sendStatus(200);
}
