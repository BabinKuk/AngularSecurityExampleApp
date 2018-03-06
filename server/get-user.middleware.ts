


import {decodeJwt} from "./security.utils";
import {Request, Response, NextFunction} from 'express';


export function retrieveUserIdFromRequest(req: Request, res: Response, next: NextFunction) {
    // retrieve jwt from session id
    const jwt = req.cookies["SESSIONID"];

    if (jwt) {
        handleSessionCookie(jwt, req)
            .then(() => next())
            .catch(err => {
                console.error(err);
                next();
        })
    }
    else {
      next();
    }
}



async function handleSessionCookie(jwt:string, req: Request) {
    try {
        // extract payload
        const payload = await decodeJwt(jwt);
        // store in user
        req["user"] = payload;

    }
    catch(err) {
        console.log("Error: Could not extract user from request:", err.message);
    }
}






