import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class Utilities {

  static parseToJson(observable: Observable<any>) {
    return observable.pipe(map(data => JSON.parse(JSON.stringify(data))));
  }

  static getDateFromFormatString(format: string): Date {
    const dateAndTime: string[] = format.split(' ');
    if (!format || dateAndTime.length < 2) {
      return null;
    }
    const date: string[] = dateAndTime[0].split('-');
    const time: string[] = dateAndTime[1].split(':');
    return new Date(+date[0], (+date[1]) - 1, +date[2], +time[0], +time[0], +time[0]);
  }

  static getFormatDate(date: Date) {
    const month = date.getMonth() + 1;
    const fullMonth = month < 10 ? '0' + month : month;
    const day = date.getDate();
    const fullDay = day < 10 ? '0' + day : day;
    const hour = date.getHours();
    const fullHour = hour < 10 ? '0' + hour : hour;
    const minute = date.getMinutes();
    const fullMinute = minute < 10 ? '0' + minute : minute;
    const second = date.getSeconds();
    const fullSecond = second < 10 ? '0' + second : second;
    return date.getFullYear() + '-' + fullMonth + '-' + fullDay + ' ' + fullHour + ':' + fullMinute + ':' + fullSecond;
  }

  static compareDateMajor(date: Date, date1: Date) {
    const year = date.getMonth() + 1;
    const year1 = date1.getMonth() + 1;
    const month = date.getMonth() + 1;
    const month1 = date1.getMonth() + 1;
    const day = date.getDate();
    const day1 = date1.getDate();
    return day > day1 && month >= month1 && year >= year1;
  }
}
