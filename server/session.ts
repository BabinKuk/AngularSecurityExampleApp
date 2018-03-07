import { Moment } from 'moment';
import { User } from '../src/app/model/user';
import moment = require('moment');

export class Session {

  static readonly VALIDITY_MINUTES = 2;
  private validUntil: Moment;

  constructor(public sessionId: string, public user: User) {
    // create validuntil timestamp
    this.validUntil = moment().add(Session.VALIDITY_MINUTES, 'minutes');
  }

  // compare current timestamp with validUntil
  isValid() {
    return moment().diff(this.validUntil, 'minutes') <= 0;
  }
}

