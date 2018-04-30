import {AnswerMessage} from './answer-message';
import {AuthUser} from '../../auth/models/auth-user';

export class Answer {
  statusCode: number;
  body: any;
  authUser: AuthUser;
  message: AnswerMessage;
}
