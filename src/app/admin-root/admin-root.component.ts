import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RoutersApp} from '../util/RoutersApp';
import {ServiceLogin} from '../services/login/service-login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-root',
  templateUrl: './admin-root.component.html',
  styleUrls: ['./admin-root.component.css']
})
export class AdminRootComponent implements OnInit {
  currentButtonPressedToolBar: HTMLButtonElement;

  constructor(private router: Router, private serviceLogin: ServiceLogin) { }

  ngOnInit() {
    if (!this.isScreenLow()) {
      this.printOfBlack(<HTMLButtonElement>document.getElementById('button-accounting'));
    } else {
      document.getElementById('div-menu-full').hidden = true;
    }
    this.router.navigateByUrl(RoutersApp.completeClasses);
  }

  printOfBlack(element: HTMLButtonElement) {
    if (this.currentButtonPressedToolBar) {
      this.currentButtonPressedToolBar.style.backgroundColor = '#353535';
    }
    this.currentButtonPressedToolBar = element;
    element.style.backgroundColor = 'black';
  }

  getRouterAccounting(): string {
    return RoutersApp.accounting;
  }

  getRouterPrograms(): string {
    return RoutersApp.programs;
  }

  getRouterClasses(): string {
    return RoutersApp.classes;
  }

  getRouterStudents(): string {
    return RoutersApp.students;
  }

  getRouterTrainers(): string {
    return RoutersApp.trainers;
  }

  getRouterQuestions(): string {
    return RoutersApp.questions;
  }

  getRouterNews(): string {
    return RoutersApp.news;
  }

  getRouterLogin(): string {
    this.closeSession();
    return RoutersApp.login;
  }

  closeSession() {
    this.serviceLogin.closeSession();
  }

  isScreenLow(): boolean {
    return window.screen.width < 900;
  }
}
