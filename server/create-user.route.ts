



import {Request, Response} from "express";
import {db} from "./database";
import {USERS} from "./database-data";
import * as argon2 from 'argon2';
import { validatePassword } from "./password-validation";


export function createUser(req: Request, res:Response) {

    const credentials = req.body;

    const errors = validatePassword(credentials.password);

    if (errors.length > 0) {
      console.log(errors);
      // response with malformed request
      res.status(400).json({errors});
    } else {
      // hash pass and store user
      argon2.hash(credentials.password)
      .then(passwordDigest => {
        // create user
        const user = db.createUser(credentials.email, passwordDigest);
        console.log(USERS);

        // response
        res.status(200).json({id:user.id, email:user.email});

      }).catch(err => {
        // ...
      });
    }
}
