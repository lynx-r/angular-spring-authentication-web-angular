import {AnswerMessage} from './answer-message';
import {AuthUser} from '../../auth/models/registerUser';

export class Answer {
  statusCode: number;
  body: any;
  authUser: AuthUser;
  message: AnswerMessage;
}
