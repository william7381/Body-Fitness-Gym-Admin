import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Confirms} from './Confirms';
import {Messages} from './Messages';
import {Constants} from './Constants';

export class Utilities {

  static parseToJson(observable: Observable<any>) {
    return observable.pipe(map(data => JSON.parse(JSON.stringify(data))));
  }

  static getYearsOfDifference(dateBigger: Date, dateLower: Date) {
    const year = dateBigger.getFullYear() + 1;
    const year1 = dateLower.getFullYear() + 1;
    const month = dateBigger.getMonth() + 1;
    const month1 = dateLower.getMonth() + 1;
    const day = dateBigger.getDate();
    const day1 = dateLower.getDate();
    console.log(month, month1);
    if (month > month1 || (month === month1 && day >= day1)) {
      return year - year1;
    }
    return (year - year1) - 1;
  }

  static getDateFromFormatString(format: string): Date {
    const dateAndTime: string[] = format.split('-');
    if (!format || dateAndTime.length < 2) {
      return null;
    }
    // const date: string[] = dateAndTime[0].split('-');
    const time: string[] = dateAndTime[3].split(':');
    return new Date(+dateAndTime[0], (+dateAndTime[1]) - 1, +dateAndTime[2], +time[0], +time[0], +time[0]);
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
    return date.getFullYear() + '-' + fullMonth + '-' + fullDay + '-' + fullHour + ':' + fullMinute + ':' + fullSecond;
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

  static getHourDisplayFromDate(dateHour: string) {
    const dateAndTime: string[] = dateHour.split('-');
    if (!dateHour || dateAndTime.length < 2) {
      return null;
    }
    const time: string[] = dateAndTime[3].split(':');
    return ((+time[0])) + ':' + time[1];

  }

  static getDateWithOutHourFromFormatDate(dateWithHour: string) {
    const dateAndTime: string[] = dateWithHour.split('-');
    return dateAndTime[0] + '/' + dateAndTime[1] + '/' + dateAndTime[2];
  }

  static serverError(res: Object) {
    console.log(res, " ---");
    if (res) {
      // @ts-ignore
      if (res[0].idError) {
        // @ts-ignore
        Confirms.showErrorType(Messages.titleErrorAdd, res[0].descripcionError);
        return true;
      }
      return false;
    }
  }

  static isOnlyLettersAndSpaces(phrase: string) {
    for (const letter of phrase) {
      if (letter === 'ñ') {

      }
    }
    return phrase.match(Constants.regexOnlyLetter);
  }
}
