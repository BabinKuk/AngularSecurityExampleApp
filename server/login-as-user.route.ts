import {Request, Response, NextFunction} from 'express';
import { db } from './database';
import { createSessionToken } from './security.utils';

export function loginAsUser(req: Request, res: Response) {
  /* // send test data
  res.status(200).json({
    id: 1,
    email: 'lilo@lilo.com',
    roles: ['STUDENT']
  }); */

  console.log('login as user', req.body);
  // send back jwt of the impersonated user (same as login service)
  const impersonatedUserEmail = req.body.email;

  // fetch all impersonated user data from db
  const impersonatedUser = db.findUserByEmail(impersonatedUserEmail);
  console.log('impersonatedUser', impersonatedUser);

  //create sesson token (same as in login service)
  createSessionToken(impersonatedUser)
    .then(sessionToken => {
      console.log("Login as user successfull");

      // add session token to cookies
      res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});

      // response
      res.status(200).json({
        id:impersonatedUser.id,
        email:impersonatedUser.email,
        roles: impersonatedUser.roles
      });
    })
    .catch(err => {
      console.log('Error login as user ' + impersonatedUserEmail, err);
      res.sendStatus(500); // forbid
    });
}
