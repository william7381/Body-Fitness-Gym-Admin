import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';

export class Notifies {
  configSuccess = {timeout: 3000, titleMaxLength: 50, position: SnotifyPosition.rightTop, showProgressBar: false};
  configWarning = {timeout: 3000, titleMaxLength: 50, position: SnotifyPosition.rightTop};
  configError = {timeout: 0, titleMaxLength: 50, position: SnotifyPosition.rightTop};

  constructor(private snotifyService: SnotifyService) {}

  showSuccess(title, body) {
    this.snotifyService.success(body, title, this.configSuccess);
  }

  showError(title, body) {
    this.snotifyService.error(body, title, this.configError);
  }

  showWarning(title, body) {
    this.snotifyService.warning(body, title, this.configWarning);
  }
}
