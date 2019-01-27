import { Injectable } from '@angular/core';
import {User} from '../../interfaces';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceLogin {
  private userLoggedIn;
  public userLogged: User | null;
  private keyUserLocalStorage = 'currentUser';

  constructor(private httpClient: HttpClient) {
    this.userLoggedIn = false;
    this.userLogged = null;
  }

  login(username: string, password: string) {
    return this.httpClient.post('/apirest/admin', {
      email: username,
      password: password,
    });
  }

  setUserLoggedIn(user: User) {
    this.userLoggedIn = true;
    this.userLogged = user;
    localStorage.setItem(this.keyUserLocalStorage, JSON.stringify(user));
  }

  getUserLoggedIn() {
    return JSON.parse(localStorage.getItem(this.keyUserLocalStorage));
  }

  isUserLoggedIn(): boolean {
    return this.userLoggedIn;
  }

  closeSession() {
    this.userLoggedIn = false;
    this.userLogged = null;
    localStorage.removeItem(this.keyUserLocalStorage);
  }
}
