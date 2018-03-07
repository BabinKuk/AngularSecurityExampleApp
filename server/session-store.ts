import { Session } from "./session";
import { User } from "../src/app/model/user";

/*
to store session in server's memory
*/
class SessionStore {
  private sessions: {[key: string]: Session} = {};

  createSession(sessionId: string, user: User) {
    this.sessions[sessionId] = new Session(sessionId, user);
  }

  findUserBySessionId(sessionId: string): User | undefined {
    const session = this.sessions[sessionId];
    return this.isSessionValid(sessionId) ? session.user : undefined;
  }

  isSessionValid(sessionId: string): boolean {
    const session = this.sessions[sessionId];
    const isSessionValid = session && session.isValid();
    return isSessionValid;
  }

  destroySession(sessionId: string) {
    console.log('delete session id');
    delete this.sessions[sessionId];
  }

}

export const sessionStore = new SessionStore();
