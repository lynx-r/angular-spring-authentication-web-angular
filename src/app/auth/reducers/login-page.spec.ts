import { reducer } from './login-page';
import * as fromLoginPage from './login-page';
import { Login, LoginSuccess, Failure, Logout } from '../actions/auth';
import { AuthUser, RegisterUser } from '../models/registerUser';

describe('LoginPageReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;

      const result = reducer(undefined, action);
      expect(result).toEqual(fromLoginPage.initialState);
    });
  });

  describe('LOGIN', () => {
    it('should make pending to true', () => {
      const user = { username: 'test' } as AuthUser;
      const createAction = new Login(user);

      const expectedResult = {
        error: null,
        pending: true,
      };

      const result = reducer(fromLoginPage.initialState, createAction);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('LOGIN_SUCCESS', () => {
    it('should have no error and no pending state', () => {
      const user = { name: 'test' } as RegisterUser;
      const createAction = new LoginSuccess({ user });

      const expectedResult = {
        error: null,
        pending: false,
      };

      const result = reducer(fromLoginPage.initialState, createAction);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('FAILURE', () => {
    it('should have an error and no pending state', () => {
      const error = 'login failed';
      const createAction = new Failure(error);

      const expectedResult = {
        error: error,
        pending: false,
      };

      const result = reducer(fromLoginPage.initialState, createAction);
      expect(result).toEqual(expectedResult);
    });
  });
});
