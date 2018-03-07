
import {db} from "./database";
import { sessionStore } from "./session-store";


export function readAllLessons(req, res) {
    // retrieve session from cookies
    const sessionId = req.cookies['SESSIONID'];
    // validate session
    const isSessionValid = sessionStore.isSessionValid(sessionId);

    // response
    if (!isSessionValid) {
      console.log('session invalid');
      res.status(403);
    } else {
      console.log('valid session');
      res.status(200).json({lessons:db.readAllLessons()});
    }
}
