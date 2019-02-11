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

  showErrorWithMethod(title, body, classOfMethod, method) {
    this.snotifyService.error(body, title, {timeout: 0, titleMaxLength: 50, position: SnotifyPosition.rightTop, buttons: [
        {text: 'Reintentar', action: () => method.call(classOfMethod), bold: true}
      ]});
  }

  showWarning(title, body) {
    this.snotifyService.warning(body, title, this.configWarning);
  }

  clear() {
    this.snotifyService.clear();
  }
}
