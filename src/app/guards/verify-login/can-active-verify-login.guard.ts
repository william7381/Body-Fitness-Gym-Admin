import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {ServiceLogin} from '../../services/login/service-login.service';
import {RoutersApp} from '../../util/RoutersApp';

@Injectable({
  providedIn: 'root'
})
export class CanActiveVerifyLoginGuard implements CanActivate {

  constructor(private router: Router, private serviceLogin: ServiceLogin) { }

  canActivate(): boolean {
    if (!this.serviceLogin.isUserLoggedIn()) {
      this.navigate(RoutersApp.login);
      return false;
    }
    return true;
  }

  private navigate(router: string) {
    this.router.navigateByUrl(router);
  }
}
