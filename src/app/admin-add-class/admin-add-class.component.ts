import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PreviewObject, ViewValue} from '../interfaces';
import {Router} from '@angular/router';
import {RoutersApp} from '../util/RoutersApp';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {DialogAddProgramComponent} from '../dialogs/add-program/dialog-add-program.component';
import {DialogAddScheduleComponent} from '../dialogs/add-schedule/dialog-add-schedule.component';
import {DialogSearchStudentComponent} from '../dialogs/search-student/dialog-search-student.component';
import {Messages} from '../util/Messages';
import {Utilities} from '../util/Utilities';
import {AppComponent} from '../app.component';
import {ServiceQueries} from '../services/queries/service-queries.service';
import {Confirms} from '../util/Confirms';
import {ServiceDataTemp} from '../services/temp/service-temp.service';

@Component({
  selector: 'app-admin-add-class',
  templateUrl: './admin-add-class.component.html',
  styleUrls: ['./admin-add-class.component.css']
})
export class AdminAddClassComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumnsSchedule: string[] = ['day', 'from', 'until', 'options'];
  schedules = [];
  displayedColumnsStudents: string[] = ['position', 'name', 'identificationNumber', 'telephone', 'options'];
  students = new MatTableDataSource();
  isLoadingTableStudents = false;
  private auxChangeTrainer = true;
  private selectedClass = null;
  messageSchedule = null;
  isLoadingTable = false;

  constructor(private router: Router, public dialog: MatDialog, private serviceQueries: ServiceQueries, private serviceDataTemp: ServiceDataTemp) {
    if (this.serviceDataTemp.selectedClass) {
      this.selectedClass = this.serviceDataTemp.selectedClass;
      this.schedules = this.selectedClass.horarioClase;
      this.messageSchedule = 'Clase: ' + this.selectedClass.servicio.nombreServicio + ' - Entrenador: ' + this.selectedClass.entrendor.nombreEntrenador;
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.students.paginator = this.paginator;
  }

  updateTable() {
    this.schedules = [];
    this.isLoadingTable = true;
    // const s = this.serviceQueries.read(Messages.urlClass + '/' + this.selectedClass.idClase);
    const s = this.serviceQueries.read(Messages.urlClass + '/' + this.selectedClass.idClase + Messages.urlGetSchedule);
    s.subscribe(res => {
        // @ts-ignore
        this.schedules = res;
        this.isLoadingTable = false;
      },
      error => {
        AppComponent.notifies.showErrorWithMethod(Messages.titleErrorConnection, Messages.titleErrorGetDataSource, this, this.updateTable);
        this.isLoadingTable = false;
      });
  }

  openDialogAddSchedule() {
    const dialogRef = this.dialog.open(DialogAddScheduleComponent, {
      width: '25%',
      height: 'max-content'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef, '70%');
  }

  openDialogSeeSchedule() {
  }

  private showScreenDark(dialogRef, width) {
    if (this.isScreenLow()) {
      dialogRef.updateSize(width, 'max-content');
    }
    this.setEventOpacityScreen(dialogRef);
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

  isScreenLow(): boolean {
    return window.screen.width < 900;
  }

  editSchedule(element) {
    const dataEdit: PreviewObject = {dataPreview: element, isPreview: false};
    const dialogRef = this.dialog.open(DialogAddScheduleComponent, {
      width: '25%',
      height: 'max-content',
      data: dataEdit
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef, '70%');
  }

  removeSchedule(element) {
    Confirms.showChooserOption(Messages.titleChooseRemove, Messages.warning).then((response) => {
      if (response.value) {
        AppComponent.spinner.show();
        this.serviceQueries.delete(Messages.urlSchedule, element.idHorario).subscribe(
          res => {
            // @ts-ignore
            AppComponent.notifies.showSuccess(Messages.titleSuccessRemove, '');
            AppComponent.spinner.hide();
            this.updateTable();
          },
          error => {
            AppComponent.spinner.hide();
            Confirms.showErrorType(Messages.titleErrorRemove, Messages.messageErrorInternetConexion);
          },
        );
      }
    });
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

  searchStudents(filterValue: string) {
    if (filterValue) {
      this.students.filter = filterValue.trim().toLowerCase();
    }
  }

  openDialogAddStudents(schedule) {
    const dataEdit: PreviewObject = {dataPreview: schedule, isPreview: false};
    const dialogRef = this.dialog.open(DialogSearchStudentComponent, {
      width: '70%',
      height: 'max-content',
      data: dataEdit
    });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.students.data.push(res);
    //     this.students._updateChangeSubscription();
    //   }
    // });
    this.showScreenDark(dialogRef, '95%');
  }

  openDialogSeeStudents(schedule) {
    const dataEdit: PreviewObject = {dataPreview: schedule, isPreview: true};
    const dialogRef = this.dialog.open(DialogSearchStudentComponent, {
      width: '70%',
      height: 'max-content',
      data: dataEdit
    });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.students.data.push(res);
    //     this.students._updateChangeSubscription();
    //   }
    // });
    this.showScreenDark(dialogRef, '95%');
  }

  closeAddClass() {
    this.router.navigateByUrl(RoutersApp.completeClasses);
  }

  getHourDisplayFromDate(dateHour: string) {
    return Utilities.getHourDisplayFromDate(dateHour);
  }

  getDateWithHourFromTypeDate(dateWithHour: string) {
    return Utilities.getDateWithHourFromTypeDate(dateWithHour);
  }
}
