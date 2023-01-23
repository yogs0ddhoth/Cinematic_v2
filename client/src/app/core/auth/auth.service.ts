import { Injectable } from '@angular/core';
import { LoginGQL, LoginQueryVariables } from '../graph/generated';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly loginGQL: LoginGQL) { }

  login(login: LoginQueryVariables) {
    return this.loginGQL.fetch(login).forEach(({data, error}) => {
      if (error) {
        throw error;
      }
      this.#loginUser(data.login.access_token);

      window.location.assign('/');
    });
  }

  #loginUser(access_token: string) {
    localStorage.setItem('token', access_token);
  }
}
