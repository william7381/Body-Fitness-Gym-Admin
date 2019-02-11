import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceDataTemp {
  selectedStudent = null;
  selectedClass = null;
  previewClass = false;
  selectedSchedule = null;

  constructor() {
  }
}
