import {Request, Response, NextFunction} from 'express';
import * as _ from 'lodash';

export function checkIfAuthorized(allowedRoles: string[], req: Request, res: Response, next: NextFunction) {
  console.log('check if authorized');

  // retrieve user info (payload)
  const userInfo = req['user'];

  // compare payload user roles with allowed roles
  const roles = _.intersection(userInfo.roles, allowedRoles);

  if (roles.length > 0) {
    console.log('user allowed to proceed');
    next(); // proceed
  } else {
    // no roles allowed, forbid
    console.log('user not allowed');
    res.sendStatus(403);
  }

}
