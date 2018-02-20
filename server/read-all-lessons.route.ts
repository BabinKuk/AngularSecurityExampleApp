
import {db} from "./database";
import { sessionStore } from "./session-store";


export function readAllLessons(req, res) {

    const sessionId = req.cookies['SESSIONID'];

    const isSessionValid = sessionStore.isSessionValid(sessionId);

    if (!isSessionValid) {
      console.log('session invalid');
      res.status(403);
    } else {
      console.log('valid session');
      res.status(200).json({lessons:db.readAllLessons()});
    }
}
