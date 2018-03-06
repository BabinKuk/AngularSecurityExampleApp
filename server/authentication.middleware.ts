import {Request, Response, NextFunction} from 'express';


export function checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
    // check if user is present in the request
    if (req['user']) {
        next();
    }
    else {
        res.sendStatus(403);
    }


}


