

import {Request, Response} from "express";
import {db} from "./database";
import * as argon2 from 'argon2';
import {DbUser} from "./db-user";
import { createSessionToken, createCsrfToken } from "./security.utils";



export function login(req: Request, res: Response) {

    const credentials = req.body;

    const user = db.findUserByEmail(credentials.email);

    if (!user) {
        res.sendStatus(403);
    }
    else {
        loginAndBuildResponse(credentials, user, res);
    }

}

async function loginAndBuildResponse(credentials:any, user:DbUser,  res: Response) {

    try {
        // create session token for user
        const sessionToken = await attemptLogin(credentials, user);
        // create csrf token for server (csrf double cookie submit defense)
        const csrfToken = await createCsrfToken(sessionToken);
        console.log("Login successful");
        // set cookie
        res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});
        // set cookie accessible from app javascript
        res.cookie('XSRF-TOKEN', csrfToken);
        // response
        res.status(200).json({id:user.id, email:user.email});

    }
    catch(err) {

        console.log("Login failed!");

        res.sendStatus(403);
    }
}

async function attemptLogin(credentials:any, user:DbUser) {

    const isPasswordValid = await argon2.verify(user.passwordDigest,
                                                credentials.password);

    if (!isPasswordValid) {
        throw new Error("Password Invalid");
    }

    return createSessionToken(user.id.toString());
}






