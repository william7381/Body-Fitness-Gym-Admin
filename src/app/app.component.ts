import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {RoutersApp} from './util/RoutersApp';
import {SnotifyService} from 'ng-snotify';
import {Notifies} from './util/Notifies';
import {NgxSpinnerService} from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  static notifies: Notifies;
  static spinner: NgxSpinnerService;
  title = 'Body-Fitness-Gym-Admin';

  constructor(private router: Router, private snotifyService: SnotifyService, private spinner: NgxSpinnerService) {
    this.router.navigateByUrl(RoutersApp.admin);
    AppComponent.notifies = new Notifies(snotifyService);
    AppComponent.spinner = spinner;
  }
}
