import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
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
import {ViewValue} from '../interfaces';

@Component({
  selector: 'app-admin-add-students',
  templateUrl: './admin-add-students.component.html',
  styleUrls: ['./admin-add-students.component.css']
})
export class AdminAddStudentsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  genders: ViewValue[] = [
    {value: '0', viewValue: 'M'},
    {value: '1', viewValue: 'F'},
  ];
  selectedGender = this.genders[0].viewValue;
  step = 0;
  hide = true;
  selectedImage = null;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  displayedColumns: string[] = ['position', 'name', 'date', 'sessions', 'price', 'options'];
  nameUser = null;
  password = null;
  name = null;
  dni = null;
  telephone = null;
  date;
  isPreview = false;
  subscriptions = new MatTableDataSource();
  emailSelected = null;

  constructor(private router: Router, public dialog: MatDialog, private serviceQueries: ServiceQueries) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // this.step = 2;
    this.subscriptions.paginator = this.paginator;
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  removeSubscription(element) {
    Confirms.showChooserOption(Messages.titleChooseRemove, Messages.warning).then((response) => {
      if (response.value) {
        AppComponent.spinner.show();
        this.serviceQueries.delete(Messages.urlSubscription, element.idSuscripcion).subscribe(
          res => {
            // @ts-ignore
            const index = this.schedules.findIndex(item => item.idSuscripcion === element.idSuscripcion);
            this.subscriptions.data.splice(index, 1);
            AppComponent.notifies.showSuccess(Messages.titleSuccessRemove, '');
            this.subscriptions._updateChangeSubscription();
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

  editSubscription(element) {

  }

  previewSubscription(element) {

  }

  private getStudent() {
    let id = -1;
    // if (this.dataEdit) {
    //   id = this.dataEdit.movimientoDeCaja.idMovimiento;
    // }
    const dateInit = new Date();
    return {'idAlumno': id, 'dniAlumno': this.dni, 'nombreAlumno': this.name, 'telefonoAlumno': this.telephone, 'emailAlumno': this.emailSelected, 'usuarioAlumno': this.nameUser, 'contrasenia': this.password, 'fechaNacimiento': Utilities.getFormatDate(this.date), 'genero': this.selectedGender};
  }

  inFileSelected(event, imageAvatar) {
    this.selectedImage = '../../assets/' + event.target.files[0].name;
    imageAvatar.src = this.selectedImage;
  }

  getErrorMessage() {
    return this.emailFormControl.hasError('required') ? 'Debes ingresar un valor' :
        this.emailFormControl.hasError('email') ? 'No es un email valido' :
            '';
  }

  openDialogAddSubscription() {
    const dialogRef = this.dialog.open(DialogAddSubscriptionComponent, {
      width: '30%',
      height: 'max-content',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.subscriptions.data = res;
      }
    });
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

  registerStudent($event) {
    if (this.nameUser && this.password && this.name && this.telephone && this.date && this.dni) {
      AppComponent.spinner.show();
      const addStudent = this.getStudent();
      console.log(addStudent);
      this.serviceQueries.create(Messages.urlStudent, addStudent).subscribe(
        res => {
          AppComponent.spinner.hide();
          AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
          this.closeAddStudent();
        },
        error => {
          console.log('---');
          console.log(error);
          AppComponent.spinner.hide();
          Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
          console.log(error);
        });
    }
  }

  closeAddStudent() {
    this.router.navigateByUrl(RoutersApp.completeStudents);
  }
}
