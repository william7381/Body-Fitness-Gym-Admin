import {AfterViewInit, Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MatTableDataSource, MatDialog, MatPaginator} from '@angular/material';
import {DialogAddSubscriptionComponent} from '../dialogs/add-suscription/dialog-add-subscription.component';
import {Confirms} from '../util/Confirms';
import {Messages} from '../util/Messages';
import {AppComponent} from '../app.component';
import {ServiceQueries} from '../services/queries/service-queries.service';
import {Utilities} from '../util/Utilities';
import {RoutersApp} from '../util/RoutersApp';
import {Router} from '@angular/router';
import {PreviewObject, PreviewObjectSubscription, ViewValue} from '../interfaces';
import {ServiceDataTemp} from '../services/temp/service-temp.service';

@Component({
  selector: 'app-admin-add-students',
  templateUrl: './admin-add-subscription.component.html',
  styleUrls: ['./admin-add-subscription.component.css']
})
export class AdminAddSubscriptionComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // genders: ViewValue[] = [
  //   {value: '0', viewValue: 'M'},
  //   {value: '1', viewValue: 'F'},
  // ];
  // selectedGender = this.genders[0].viewValue;
  // step = 0;
  // hide = true;
  // selectedImage = null;
  // emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  displayedColumns: string[] = ['position', 'name', 'date', 'sessions', 'price', 'options'];
  subscriptions = new MatTableDataSource();
  isLoadingTable = false;
  messageStudent = null;
  private selectedStudent = null;
  // nameUser = null;
  // password = null;
  // name = null;
  // dni = null;
  // telephone = null;
  // date;
  // isPreview = false;
  // emailSelected = null;

  constructor(private router: Router, public dialog: MatDialog, private serviceQueries: ServiceQueries, private serviceDataTemp: ServiceDataTemp) {
    // console.log('---');
    // console.log(this.serviceDataTemp.selectedStudent);
    this.selectedStudent = this.serviceDataTemp.selectedStudent;
    this.messageStudent = 'Alumno: ' + this.selectedStudent.nombreAlumno + ' Dni: ' + this.selectedStudent.dniAlumno;
    this.subscriptions.data = this.selectedStudent.historialSuscripcion;
    // console.log('---');
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // this.updateTable();
    this.subscriptions.paginator = this.paginator;
  }

  updateTable() {
    this.subscriptions.data = [];
    this.isLoadingTable = true;
    // const m = this.serviceQueries.read(Messages.urlAllSubscriptions + Messages.urlStudent + '/' + this.selectedStudent.dniAlumno);
    const m = this.serviceQueries.read(Messages.urlStudent + '/' + this.selectedStudent.dniAlumno);
    m.subscribe(res => {
        // @ts-ignore
        if (res && res.value) {
          // @ts-ignore
          this.subscriptions.data = res.value.historialSuscripcion;
          this.isLoadingTable = false;
        }
      },
      error => {
        AppComponent.notifies.showErrorWithMethod(Messages.titleErrorConnection, Messages.titleErrorGetDataSource, this, this.updateTable);
        this.isLoadingTable = false;
      });
  }

  removeSubscription(element) {
    Confirms.showChooserOption(Messages.titleChooseRemove, Messages.warning).then((response) => {
      if (response.value) {
        AppComponent.spinner.show();
        this.serviceQueries.delete(Messages.urlSubscription, element.idSuscripcion).subscribe(
          res => {
            // @ts-ignore
            this.updateTable();
            AppComponent.notifies.showSuccess(Messages.titleSuccessRemove, '');
            AppComponent.spinner.hide();
          },
          error => {
            console.log(error);
            AppComponent.spinner.hide();
            Confirms.showErrorType(Messages.titleErrorRemove, Messages.messageErrorInternetConexion);
          },
        );
      }
    });
  }

  editSubscription(element) {
    const dataEdit: PreviewObjectSubscription = {dataPreview: element, student: this.selectedStudent, isPreview: false};
    const dialogRef = this.dialog.open(DialogAddSubscriptionComponent, {
      width: '30%',
      height: 'max-content',
      data: dataEdit,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef);
  }

  previewSubscription(element) {
    const dataEdit: PreviewObjectSubscription = {dataPreview: element, student: this.selectedStudent, isPreview: true};
    const dialogRef = this.dialog.open(DialogAddSubscriptionComponent, {
      width: '30%',
      height: 'max-content',
      data: dataEdit,
    });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.updateTable();
    //   }
    // });
    this.showScreenDark(dialogRef);
  }

  openDialogAddSubscription() {
    const dataEdit: PreviewObjectSubscription = {dataPreview: null, student: this.selectedStudent, isPreview: false};
    const dialogRef = this.dialog.open(DialogAddSubscriptionComponent, {
      width: '30%',
      height: 'max-content',
      data: dataEdit
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
      dialogRef.updateSize('70%', 'max-content');
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

  closeAddSubscription() {
    this.router.navigateByUrl(RoutersApp.completeStudents);
  }
}
