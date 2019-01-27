
export class RoutersApp {

  static readonly login: string = '';
  static readonly admin: string = 'admin';
  static readonly accounting: string = 'accounting';
  static readonly programs: string = 'programs';
  static readonly classes: string = 'classes';
  static readonly addClass: string = 'addClass';
  static readonly students: string = 'students';
  static readonly addStudent: string = 'addStudent';
  static readonly trainers: string = 'trainers';
  static readonly completeAccounting: string = RoutersApp.admin + '/' + RoutersApp.accounting;
  static readonly completeStudents = RoutersApp.admin + '/' + RoutersApp.students;
  static readonly completeAddStudent = RoutersApp.admin + '/' + RoutersApp.addStudent;
  static readonly completeClasses = RoutersApp.admin + '/' + RoutersApp.classes;
  static readonly completeAddClass = RoutersApp.admin + '/' + RoutersApp.addClass;
  static readonly completePrograms = RoutersApp.admin + '/' + RoutersApp.programs;
  static readonly completeTrainers = RoutersApp.admin + '/' + RoutersApp.trainers;

  constructor() { }
}
