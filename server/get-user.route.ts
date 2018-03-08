

import {Request, Response} from "express";
import { db } from "./database";



export function getUser(req:Request, res:Response) {

    /* const user = {
        email:'test@gmail.com'
    }; */
    // get user data from db
    const user = db.findUserById(req['userId']);

    // response
    if (user) {
        res.status(200).json({email: user.email, id: user.id});
    }
    else {
        res.sendStatus(204); // no content
    }
}
