import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminProgramsComponent} from '../../admin-programs/admin-programs.component';
import {AdminAddClassComponent} from '../../admin-add-class/admin-add-class.component';
import {ViewValue} from '../../interfaces';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {Utilities} from '../../util/Utilities';
import {AppComponent} from '../../app.component';
import {Messages} from '../../util/Messages';
import {Confirms} from '../../util/Confirms';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './dialog-add-schedule.component.html',
  styleUrls: ['./dialog-add-schedule.component.css']
})
export class DialogAddScheduleComponent implements OnInit {
  days: ViewValue[] = [
    {value: '0', viewValue: 'Lunes'},
    {value: '1', viewValue: 'Martes'},
    {value: '2', viewValue: 'Miercoles'},
    {value: '3', viewValue: 'Jueves'},
    {value: '4', viewValue: 'Viernes'},
    {value: '5', viewValue: 'Sabado'},
    {value: '6', viewValue: 'Domingo'}
  ];
  selectedDay = this.days[0].viewValue;
  selectedHourFrom = '00:00';
  selectedHourUntil = '00:00';
  alertErrorHour = false;
  tittle = 'Agregar Horario';

  constructor(public dialogRef: MatDialogRef<AdminAddClassComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit) {
    if (this.dataEdit) {
      this.selectedDay = this.dataEdit.dia;
      this.selectedHourFrom = this.dataEdit.horaInicio;
      this.selectedHourUntil = this.dataEdit.horaFin;
      this.tittle = 'Editar Horario';
    }
  }

  ngOnInit() {
  }

  registerSchedule(event, toggleTimePickerFrom, toggleTimepickerUntil) {
    const hourFrom = toggleTimePickerFrom.selectedHour.time;
    const minuteFrom = toggleTimePickerFrom.selectedMinute.time;
    const hourUntil = toggleTimepickerUntil.selectedHour.time;
    const minuteUntil = toggleTimepickerUntil.selectedMinute.time;
    if (hourUntil > hourFrom || (hourUntil === hourFrom && minuteUntil > minuteFrom)) {
      if (this.dataEdit) {
        this.edit();
      } else {
        this.add();
      }
      this.alertErrorHour = false;
      return;
    }
    this.alertErrorHour = true;
  }

  private getSchedule() {
    let id = -1;
    if (this.dataEdit) {
      id = this.dataEdit.idSchedule;
    }
    return {'idSchedule': id, 'dia': this.selectedDay, 'horaInicio': this.selectedHourFrom, 'horaFin': this.selectedHourUntil};
  }

  private edit() {
    AppComponent.spinner.show();
    const schedule = this.getSchedule();
    this.serviceQueries.update(Messages.urlSchedule, schedule).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, '');
        this.dialogRef.close(res);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
      });
  }

  private add() {
    AppComponent.spinner.show();
    const schedule = this.getSchedule();
    this.serviceQueries.create(Messages.urlSchedule, schedule).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.dialogRef.close(res);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  closeDialogAddSchedule() {
    this.dialogRef.close();
  }
}
