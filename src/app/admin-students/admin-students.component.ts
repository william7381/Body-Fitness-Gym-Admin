import {AfterViewInit, Component, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {DialogAddMovementComponent} from '../dialogs/add-movement/dialog-add-movement.component';
import {PreviewObject, ViewValue} from '../interfaces';
import {Router} from '@angular/router';
import {RoutersApp} from '../util/RoutersApp';
import {Messages} from '../util/Messages';
import {Utilities} from '../util/Utilities';
import {AppComponent} from '../app.component';
import {ServiceQueries} from '../services/queries/service-queries.service';
import {Confirms} from '../util/Confirms';
import {DialogAddTrainerComponent} from '../dialogs/add-trainer/dialog-add-trainer.component';
import {DialogAddStudentComponent} from '../dialogs/add-student/dialog-add-student.component';
import {ServiceDataTemp} from '../services/temp/service-temp.service';

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.css']
})
export class AdminStudentsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['position', 'nombre', 'fechaNacimiento', 'dni', 'telefono', 'email', 'genero', 'options'];
  dataSource = new MatTableDataSource();
  //----------------------------------------------------
  typesBloods: ViewValue[] = [
    {value: '0', viewValue: 'A+'},
    {value: '0', viewValue: 'A-'},
    {value: '1', viewValue: 'B+'},            // Debe venir desde la base de datos
    {value: '1', viewValue: 'B-'},            // Debe venir desde la base de datos
    {value: '2', viewValue: 'AB+'},
    {value: '2', viewValue: 'AB-'},
    {value: '2', viewValue: 'O+'},
    {value: '2', viewValue: 'O-'},
  ];
  selectedTypeBlood = this.typesBloods[0].value;
  isLoadingTable = true;
  //-----------------------------------------------

  constructor(public dialog: MatDialog, private router: Router, private serviceQueries: ServiceQueries, private serviceSubscription: ServiceDataTemp) {}

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.updateTable();
    this.dataSource.paginator = this.paginator;
  }

  updateTable() {
    this.dataSource.data = [];
    this.isLoadingTable = true;
    const m = this.serviceQueries.read(Messages.urlAllStudents);
    m.subscribe(res => {
        // @ts-ignore
        this.dataSource.data = res;
        this.isLoadingTable = false;
      },
      error => {
        AppComponent.notifies.showErrorWithMethod(Messages.titleErrorConnection, Messages.titleErrorGetDataSource, this, this.updateTable);
        this.isLoadingTable = false;
      });
  }

  search(filterValue: string) {
    if (filterValue) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  // preview(element) {
  //
  // }
  //
  // edit(element) {
  // }
  //
  // remove(element) {
  //   Confirms.showChooserOption(Messages.titleChooseRemove, Messages.warning).then((response) => {
  //     if (response.value) {
  //       AppComponent.spinner.show();
  //       this.serviceQueries.delete(Messages.urlClass, element.idAlumno).subscribe(
  //         res => {
  //           this.updateTable();
  //           AppComponent.notifies.showSuccess(Messages.titleSuccessRemove, '');
  //           AppComponent.spinner.hide();
  //         },
  //         error => {
  //           AppComponent.spinner.hide();
  //           Confirms.showErrorType(Messages.titleErrorRemove, Messages.messageErrorInternetConexion);
  //         },
  //       );
  //     }
  //   });
  // }
  //
  // openDialogAddStudent() {
  //   this.router.navigateByUrl(RoutersApp.completeAddStudent);
  // }

  preview(element) {
    const dataEdit: PreviewObject = {dataPreview: element, isPreview: true};
    const dialogRef = this.dialog.open(DialogAddStudentComponent, {
      width: '30%',
      height: '90%',
      data: dataEdit
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef);
  }

  edit(element) {
    const dataEdit: PreviewObject = {dataPreview: element, isPreview: false};
    const dialogRef = this.dialog.open(DialogAddStudentComponent, {
      width: '30%',
      height: '90%',
      data: dataEdit
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef);
  }

  remove(element) {
    Confirms.showChooserOption(Messages.titleChooseRemove, Messages.warning).then((response) => {
      if (response.value) {
        AppComponent.spinner.show();
        this.serviceQueries.delete(Messages.urlStudent, element.dniAlumno).subscribe(
          res => {
            this.updateTable();
            AppComponent.notifies.showSuccess(Messages.titleSuccessRemove, '');
            AppComponent.spinner.hide();
          },
          error => {
            // console.log(error);
            AppComponent.spinner.hide();
            Confirms.showErrorType(Messages.titleErrorRemove, Messages.messageErrorInternetConexion);
          },
        );
      }
    });
  }

  subscription(element) {
    this.serviceSubscription.selectedStudent = element;
    this.router.navigateByUrl(RoutersApp.completeAddStudent);
  }

  openDialogAddStudent() {
    const dialogRef = this.dialog.open(DialogAddStudentComponent, {
      width: '35%',
      height: '90%',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef);
  }

  private showScreenDark(dialogRef) {
    if (this.isScreenLow()) {
      dialogRef.updateSize('70%', '90%');
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
      '  opacity: 0.1;      /* fx, safari, opera */';
  }

  private setOpacityScreenRegular(divMain: HTMLElement) {
    // @ts-ignore
    divMain.style = 'filter: alpha(opacity=1); /* internet explorer */\n' +
      '  -khtml-opacity: 1;      /* khtml, old safari */\n' +
      '  -moz-opacity: 1;      /* mozilla, netscape */\n' +
      '  opacity: 1;      /* fx, safari, opera */';
  }

  isScreenLow(): boolean {
    return window.screen.width < 900;
  }
}
