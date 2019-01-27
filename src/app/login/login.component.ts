import { Component, OnInit } from '@angular/core';
import {RoutersApp} from '../util/RoutersApp';
import {ServiceLogin} from '../services/login/service-login.service';
import {User} from '../interfaces';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  alertIncorrect = false;
  alertServer = false;

  constructor(private router: Router, private serviceLogin: ServiceLogin) { }

  ngOnInit() {
  }

  loginUser(event: Event) {
    this.alertIncorrect = false;
    this.alertServer = false;
    const elementUserName = (<HTMLInputElement>document.getElementById('userName'));
    const elementPassword = (<HTMLInputElement>document.getElementById('password'));
    const username: string = elementUserName.value;
    const password: string = elementPassword.value;
    event.preventDefault();

    this.serviceLogin.login(username, password).subscribe(
      res => {
        console.log(res);
        if (res) {
          const user: User = {userName: username};
          this.serviceLogin.setUserLoggedIn(user);
          localStorage.setItem('userName', username);
        } else {
          alert('Usuario o contraseña incorrecta');
          this.alertIncorrect = true;
          elementPassword.value = '';
          return;
        }
      },
      error => {
        console.error(error);
        alert('No podemos conectarnos con el servidor en este momento, por favor comprueba tu conexion a internet o intenta mas tarde.');
        this.alertServer = true;
        elementPassword.value = '';
      },
      () => this.navigate(RoutersApp.admin)
    );
  }

  private navigate(router: string) {
    this.router.navigateByUrl(router);
  }
}
