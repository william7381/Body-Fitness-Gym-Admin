import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatTableDataSource} from '@angular/material';
import {AdminProgramsComponent} from '../../admin-programs/admin-programs.component';
import {AdminAddClassComponent} from '../../admin-add-class/admin-add-class.component';
import {PreviewObject, ViewValue} from '../../interfaces';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {Utilities} from '../../util/Utilities';
import {AppComponent} from '../../app.component';
import {Messages} from '../../util/Messages';
import {Confirms} from '../../util/Confirms';
import {DialogSearchStudentComponent} from '../search-student/dialog-search-student.component';
import {ServiceDataTemp} from '../../services/temp/service-temp.service';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './dialog-add-schedule.component.html',
  styleUrls: ['./dialog-add-schedule.component.css']
})
export class DialogAddScheduleComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
  date = new Date();
  isPreview = false;

  displayedColumnsStudents: string[] = ['position', 'name', 'identificationNumber', 'telephone', 'options'];
  students = new MatTableDataSource();

  constructor(private serviceDataTemp: ServiceDataTemp, public dialog: MatDialog, public dialogRef: MatDialogRef<AdminAddClassComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit: PreviewObject) {
    if (this.dataEdit) {
      const schedule = this.dataEdit.dataPreview;
      this.selectedDay = schedule.dia;
      this.selectedHourFrom = Utilities.getHourDisplayFromDate(schedule.horaInicio);
      this.selectedHourUntil = Utilities.getHourDisplayFromDate(schedule.horaFin);
      this.tittle = 'Editar Horario';
      if (this.dataEdit.isPreview) {
        this.isPreview = true;
      }
    }
  }

  ngOnInit() {
    this.students.paginator = this.paginator;
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

  openDialogAddStudent() {
    const dialogRef = this.dialog.open(DialogSearchStudentComponent, {
      width: '70%',
      height: 'max-content',
      data: this.students.data
    });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.students.data.push(res);
    //     this.students._updateChangeSubscription();
    //   }
    // });
    this.showScreenDark(dialogRef, '95%');
  }

  previewStudent(element) {
  }

  removeStudent(element) {
    Confirms.showChooserOption(Messages.titleChooseRemove, Messages.warning).then((response) => {
      if (response.value) {
        // @ts-ignore
        const index = this.students.data.findIndex(item => item.idAlumno === element.idAlumno);
        this.students.data.splice(index, 1);
        AppComponent.notifies.showSuccess(Messages.titleSuccessRemove, '');
        this.students._updateChangeSubscription();
      }
    });
  }

  private showScreenDark(dialogRef, width) {
    if (this.isScreenLow()) {
      dialogRef.updateSize(width, 'max-content');
    }
    this.setEventOpacityScreen(dialogRef);
  }

  isScreenLow(): boolean {
    return window.screen.width < 900;
  }

  private setEventOpacityScreen(dialogRef) {
    const divMain = document.getElementById('div-main');
    // events for opacity screen
    this.setOpacityScreenLight(divMain);
    // events for leave the screen regular
    dialogRef.beforeClosed().subscribe(result => {
      this.setOpacityScreenRegular(divMain);
    });
  }

  private setOpacityScreenLight(divMain: HTMLElement) {
    // @ts-ignore
    divMain.style = 'filter: alpha(opacity=0.1); /* internet explorer */\n' +
      '  -khtml-opacity: 0.1;      /* khtml, old safari */\n' +
      '  -moz-opacity: 0.1;      /* mozilla, netscape */\n' +
      '  opacity: 0.1;      /* fx, safari, opera */\n' +
      'text-align: center;';
  }

  private setOpacityScreenRegular(divMain: HTMLElement) {
    // @ts-ignore
    divMain.style = 'filter: alpha(opacity=1); /* internet explorer */\n' +
      '  -khtml-opacity: 1;      /* khtml, old safari */\n' +
      '  -moz-opacity: 1;      /* mozilla, netscape */\n' +
      '  opacity: 1;      /* fx, safari, opera */\n' +
      'text-align: center;';
  }

  private getSchedule() {
    let id = -1;
    if (this.dataEdit && this.dataEdit.dataPreview) {
      id = this.dataEdit.dataPreview.idHorario;
    }
    // return {'idSchedule': id, 'dia': this.selectedDay, 'horaInicio': this.selectedHourFrom, 'horaFin': this.selectedHourUntil};
    const horaInicio = new Date(this.date);
    const s1 = this.selectedHourFrom.split(':');
    // @ts-ignore
    horaInicio.setHours(s1[0], s1[1]);
    const horaFin = new Date(this.date);
    const s2 = this.selectedHourUntil.split(':');
    // @ts-ignore
    horaFin.setHours(s2[0], s2[1]);
    // 'dia': Utilities.getFormatDate(this.date)
    if (id >= 0) {
      return {'idHorario': id, 'horaInicio': Utilities.getFormatDate(horaInicio), 'horaFin': Utilities.getFormatDate(horaFin)/*, 'asistencia': this.students.data*/};
    } else {
      return {'horaInicio': Utilities.getFormatDate(horaInicio), 'horaFin': Utilities.getFormatDate(horaFin)/*, 'asistencia': this.students.data*/};
    }
  }

  searchStudents(filterValue: string) {
    if (filterValue) {
      this.students.filter = filterValue.trim().toLowerCase();
    }
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
    this.serviceQueries.create(Messages.urlSchedule + Messages.urlClass + '/' + this.serviceDataTemp.selectedClass.idClase, schedule).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.dialogRef.close(res);
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  closeDialogAddSchedule() {
    this.dialogRef.close();
  }
}
