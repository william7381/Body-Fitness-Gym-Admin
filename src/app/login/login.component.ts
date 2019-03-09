import { Component, OnInit } from '@angular/core';
import {RoutersApp} from '../util/RoutersApp';
import {ServiceLogin} from '../services/login/service-login.service';
import {User} from '../interfaces';
import {Router} from '@angular/router';
import {Utilities} from '../util/Utilities';
import {Message} from '@angular/compiler/src/i18n/i18n_ast';
import {Messages} from '../util/Messages';
import {AppComponent} from '../app.component';
import {Confirms} from '../util/Confirms';
import {Constants} from '../util/Constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName = '';
  password = '';
  hide = true;
  constants = Constants;

  constructor(private router: Router, private serviceLogin: ServiceLogin) { }

  ngOnInit() {
  }

  loginUser(event: Event, inputNameUser, inputPassword) {
    if (inputNameUser.value && inputPassword.value) {
      event.preventDefault();
      AppComponent.spinner.show();

      this.serviceLogin.login(Messages.urlLoginAdmin, this.userName, this.password).subscribe(
        res => {
          AppComponent.spinner.hide();
          // @ts-ignore
          if (res && res.length !== 0) {
            const user: User = {userName: this.userName};
            this.serviceLogin.setUserLoggedIn(user);
            localStorage.setItem('userName', this.userName);
          } else {
            inputPassword.value = '';
            Confirms.showErrorType(Messages.titleErrorData, Messages.messageErrorLogin);
            return;
          }
        },
        error => {
          Confirms.showErrorType(Messages.titleErrorConnection, Messages.messageErrorInternetConexion);
          AppComponent.spinner.hide();
        },
        () => this.navigate(RoutersApp.admin)
      );
    }
  }

  private navigate(router: string) {
    this.router.navigateByUrl(router);
  }
}
