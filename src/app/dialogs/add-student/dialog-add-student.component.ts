import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import {AdminTrainersComponent} from '../../admin-trainers/admin-trainers.component';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {PreviewObject, ViewValue} from '../../interfaces';
import {FormControl, Validators} from '@angular/forms';
import {Confirms} from '../../util/Confirms';
import {Messages} from '../../util/Messages';
import {AppComponent} from '../../app.component';
import {Utilities} from '../../util/Utilities';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialog-add-student.component.html',
  styleUrls: ['./dialog-add-student.component.css']
})
export class DialogAddStudentComponent implements OnInit {
  genders: ViewValue[] = [
    {value: '0', viewValue: 'M'},
    {value: '1', viewValue: 'F'},
  ];
  selectedGender = this.genders[0].viewValue;
  selectedImage = null;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  nameUser = null;
  password = null;
  name = null;
  urlImage: string = null;
  dni = null;
  telephone = null;
  date;
  isPreview = false;
  emailSelected = null;
  title = 'Agregar Alumno';
  nameButtonSuccess = 'Agregar';
  nameButtonCancel = 'Cancelar';
  hide = true;

  constructor(public dialogRef: MatDialogRef<AdminTrainersComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit: PreviewObject) {
    if (this.dataEdit && this.dataEdit.dataPreview) {
      const object = this.dataEdit.dataPreview;
      this.urlImage = object.urlImagenUsuario;
      this.name = object.nombreAlumno;
      this.dni = object.dniAlumno;
      this.telephone = object.telefonoAlumno;
      this.emailSelected = object.emailAlumno;
      this.nameUser = object.usuarioAlumno;
      this.password = object.contrasenia;
      this.date = Utilities.getDateFromFormatString(object.fechaNacimiento);
      this.selectedGender = object.genero;
      this.title = 'Editar Programa';
      this.nameButtonSuccess = 'Editar';
      if (this.dataEdit.isPreview) {
        this.isPreview = true;
        this.nameButtonCancel = 'Cerrar';
        this.emailFormControl.disable();
      }
    }
    window.scroll(0, 0);
  }

  ngOnInit() {
  }

  private getStudent() {
    let id = -1;
    if (this.dataEdit && this.dataEdit.dataPreview) {
      id = this.dataEdit.dataPreview.idAlumno;
    }
    return {'idAlumno': id, 'urlImagenUsuario': this.urlImage, 'nombreAlumno': this.name, 'dniAlumno': this.dni, 'usuarioAlumno': this.nameUser, 'contrasenia': this.password, 'telefonoAlumno': this.telephone, 'emailAlumno': this.emailSelected, 'fechaNacimiento': Utilities.getFormatDate(this.date), 'genero': this.selectedGender};
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

  closeDialogAddStudent() {
    this.dialogRef.close();
  }

  registerStudent(event: Event) {
    if (this.name && this.dni && this.telephone && this.nameUser && this.password && this.date) {
      if (this.dataEdit) {
        this.edit();
      } else {
        this.add();
      }
    } else {
      Confirms.showErrorType(Messages.titleErrorRegisterDialog, Messages.messageErrorRegisterDialog);
    }
  }

  private edit() {
    AppComponent.spinner.show();
    const student = this.getStudent();
    this.serviceQueries.update(Messages.urlStudent, student).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, '');
        this.dialogRef.close(student);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
      });
  }

  private add() {
    AppComponent.spinner.show();
    const student = this.getStudent();
    this.serviceQueries.create(Messages.urlStudent, student).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.dialogRef.close(student);
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }
}