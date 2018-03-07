import {Request, Response} from 'express';
import { sessionStore } from './session-store';
import { db } from './database';
import { DbUser } from './db-user';
import * as argon2 from 'argon2';
import { randomBytes } from './security.utils';

export function login(req: Request, res: Response) {
  console.log('login');
  // retrieve credentials from request
  const credentials = req.body;
  // get user data from server's memory
  const user = db.findUserByEmail(credentials.email);

  // response
  if (!user) {
    res.sendStatus(403);
  } else {
    // attempt login
    loginAndBuildResponse(credentials, user, res);
  }

}

async function loginAndBuildResponse(credentials: any, user: DbUser, res: Response) {
  try {
    const sessionId = attemptLogin(credentials, user);
    console.log('login ok');

    // set session cookie and send response
    res.cookie('SESSIONID', sessionId, {httpOnly: true, secure: true});
    res.status(200).json({id:user.id, email:user.email});
  } catch (err) {
    console.log('login failed');
    res.sendStatus(403);
  }
}

async function attemptLogin(credentials: any, user: DbUser) {
  // validate password
  const isPasswordValid = await argon2.verify(user.passwordDigest, credentials.password);

  if (!isPasswordValid) {
    throw new Error('Password is invalid');
  }

  // create session id
  const sessionId = await randomBytes(32).then(bytes => bytes.toString('hex'));
  console.log('sessionId', sessionId);

  // establish user session
  sessionStore.createSession(sessionId, user);

  return sessionId;
}
