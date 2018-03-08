
import {Request, Response} from "express";
import {db} from "./database";
import * as argon2 from 'argon2';
import {validatePassword} from "./password-validation";
import moment = require("moment");
import { createSessionToken, createCsrfToken } from "./security.utils";




export function createUser(req: Request, res:Response) {

    const credentials = req.body;

    const errors = validatePassword(credentials.password);

    if (errors.length > 0) {
        res.status(400).json({errors});
    }
    else {

        createUserAndSession(res, credentials)
          .catch(() => {
            res.sendStatus(500);
          });
    }

}

async function createUserAndSession(res:Response, credentials) {

    const passwordDigest = await argon2.hash(credentials.password);

    const user = db.createUser(credentials.email, passwordDigest);
    // create session token for user
    const sessionToken = await createSessionToken(user.id.toString());
    // create csrf token for server csrf cookie defense
    const csrfToken = await createCsrfToken(sessionToken);
    // set cookie
    res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});
    // set cookie accessible from app javascript
    res.cookie('XSRF-TOKEN', csrfToken);
    // response
    res.status(200).json({id:user.id, email:user.email});
}






