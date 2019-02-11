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
  programs;
  selectedProgramName;
  selectedProgram;
  trainers = null;
  selectedTrainerName;
  selectedTrainer;
  numberQuotas = null;
  description = null;
  displayedColumnsSchedule: string[] = ['day', 'from', 'until', 'options'];
  schedules = [];
  displayedColumnsStudents: string[] = ['position', 'name', 'identificationNumber', 'telephone', 'options'];
  students = new MatTableDataSource();
  isLoadingTableStudents = false;
  private auxChangeTrainer = true;
  private selectedClass = null;
  isPreview = false;

  constructor(private router: Router, public dialog: MatDialog, private serviceQueries: ServiceQueries, private serviceDataTemp: ServiceDataTemp) {
    if (this.serviceDataTemp.selectedClass) {
      this.selectedClass = this.serviceDataTemp.selectedClass;
      this.numberQuotas = this.selectedClass.numeroCupos;
      this.description = this.selectedClass.descripcion;
      this.schedules = this.selectedClass.horarioClase;
      if (this.serviceDataTemp.previewClass) {
        this.isPreview = true;
      }
      console.log(this.selectedClass);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.updateTrainers();
    this.students.paginator = this.paginator;
  }

  updateTrainers() {
    const s = this.serviceQueries.read(Messages.urlAllTrainers);
    s.subscribe(res => {
        this.trainers = res;
        this.selectedTrainerName = this.trainers[0].nombreEntrenador;
        this.selectedTrainer = this.trainers[0];
        this.programs = this.selectedTrainer.entrenadorServicio;
        if (this.programs && this.programs.length > 0) {
          this.selectedProgram = this.programs[0];
          this.selectedProgramName = this.selectedProgram.nombreServicio;
        }
        this.updatePrograms(this.selectedTrainer);
        this.auxChangeTrainer = true;
        // cargar programa para edit y preview
        if (this.selectedClass) {
          const trainer = this.selectedClass.entrendor;
          this.selectedTrainer = trainer;
          this.selectedTrainerName = trainer.nombreEntrenador;
          this.programs = trainer.entrenadorServicio;
          const service = this.selectedClass.servicio;
          this.selectedProgram = service.servicio;
          this.selectedProgramName = service.nombreServicio;
        }
      },
      error => {
        AppComponent.notifies.showError(Messages.titleErrorConnection, Messages.titleErrorGetTrainers);
      });
  }

  finishUpdatePrograms() {
    this.auxChangeTrainer = true;
  }

  updatePrograms(trainer) {
    if (this.auxChangeTrainer) {
      if (trainer.dniEntrenador !== this.selectedTrainer.dniEntrenador) {
        this.selectedTrainer = trainer;
        if (this.trainers) {
          this.programs = trainer.entrenadorServicio;
          if (this.programs && this.programs.length > 0) {
            this.selectedProgramName = this.programs[0].nombreServicio;
            this.selectedProgram = this.programs[0];
          }
        }
      } else {
        this.auxChangeTrainer = true;
        return;
      }
    }
    this.auxChangeTrainer = false;
    // if (this.auxChangeTrainer === 2) {
    //   this.auxChangeTrainer = 0;
    // }
  }

  openDialogAddSchedule() {
    const dialogRef = this.dialog.open(DialogAddScheduleComponent, {
      width: '30%',
      height: 'max-content'
    });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.students.data = res;
    //   }
    // });
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
      width: '30%',
      height: 'max-content',
      data: dataEdit
    });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.schedules = res;
    //   }
    // });
    this.showScreenDark(dialogRef, '70%');
  }

  removeSchedule(element) {
    Confirms.showChooserOption(Messages.titleChooseRemove, Messages.warning).then((response) => {
      if (response.value) {
        AppComponent.spinner.show();
        this.serviceQueries.delete(Messages.urlSchedule, element.idSchedule).subscribe(
          res => {
            // @ts-ignore
            const index = this.schedules.findIndex(item => item.idSchedule === element.idSchedule);
            this.schedules.splice(index, 1);
            AppComponent.notifies.showSuccess(Messages.titleSuccessRemove, '');
            AppComponent.spinner.hide();
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

  getClass() {
    let id = -1;
    if (this.selectedClass) {
      id = this.selectedClass.idClase;
      return {'idClase': id, 'descripcion': this.description, 'numeroCupos': this.numberQuotas, 'horarios': this.schedules, 'entrendor': this.selectedTrainer, 'servicio': this.selectedProgram};
    } else {
      return {'idClase': id, 'descripcion': this.description, 'numeroCupos': this.numberQuotas, 'horarios': this.schedules /*'entrenador': this.selectedTrainer, 'servicio': this.selectedProgramName, 'asistencia': this.students.data,*/};
    }
  }

  registerClass($event) {
    if (this.trainers && this.trainers.length === 0) {
      Confirms.showErrorType(Messages.titleErrorClassNeedTrainer, Messages.messageErrorClassNeed);
      return;
    }
    if (this.numberQuotas) {
      if (!this.selectedClass) {
        this.addClass();
      } else {
        this.editClass();
      }
    } else {
      Confirms.showErrorType(Messages.titleErrorNeedQuotas, Messages.messageErrorNeedQuotas);
    }
  }

  private editClass() {
    AppComponent.spinner.show();
    const addClass = this.getClass();
    this.serviceQueries.update(Messages.urlClass, addClass).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, '');
        this.closeAddClass();
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
        console.log(error);
      });
  }

  private addClass() {
    AppComponent.spinner.show();
    const addClass = this.getClass();
    this.serviceQueries.create(Messages.urlClass + Messages.urlService + '/' + this.selectedProgram.idServicio + Messages.urlTrainer + '/' + this.selectedTrainer.dniEntrenador, addClass).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.closeAddClass();
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
        console.log(error);
      });
  }

  closeAddClass() {
    this.router.navigateByUrl(RoutersApp.completeClasses);
  }
}
