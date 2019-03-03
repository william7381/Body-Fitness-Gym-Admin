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
import {Constants} from '../../util/Constants';
import {FileUpload} from '../../util/upload';
import * as firebase from "firebase";
import {UploadService} from '../../services/upload-service/upload.service';

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
  urlImage = "../../../assets/avatar.jpg";
  dni = null;
  telephone = null;
  date;
  isPreview = false;
  emailSelected = null;
  title = 'Agregar Alumno';
  nameButtonCancel = 'Cancelar';
  hide = true;
  constants = Constants;
  utilities = Utilities;
  progressLoadImage;
  studentEdit = null;

  constructor(public dialogRef: MatDialogRef<AdminTrainersComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit: PreviewObject, public uploadService: UploadService) {
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
      this.title = 'Alumno';
      this.studentEdit = object;
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
    // let id = -1;
    if (this.studentEdit) {
      // id = this.dataEdit.dataPreview.idAlumno;
      return {'dniAlumno': this.dni, 'urlImagenUsuario': this.urlImage, 'nombreAlumno': this.name, 'usuarioAlumno': this.nameUser, 'contrasenia': this.password, 'telefonoAlumno': this.telephone, 'emailAlumno': this.emailSelected, 'fechaNacimiento': Utilities.getFormatDate(this.date), 'genero': this.selectedGender, 'historialSuscripcion': this.studentEdit.historialSuscripcion};
    }
    return {'dniAlumno': this.dni, 'urlImagenUsuario': this.urlImage, 'nombreAlumno': this.name, 'usuarioAlumno': this.nameUser, 'contrasenia': this.password, 'telefonoAlumno': this.telephone, 'emailAlumno': this.emailSelected, 'fechaNacimiento': Utilities.getFormatDate(this.date), 'genero': this.selectedGender};
  }

  inFileSelected(event, imageAvatar) {
    this.selectedImage = window.URL.createObjectURL(event.target.files[0]);
    imageAvatar.src = this.selectedImage;
    // console.log(imageAvatar.src);
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
      if (this.name.match(Constants.regexOnlyLetterAndSpace) === null) {
        Confirms.showErrorType(Messages.titleErrorPatternOnlyLettersAndSpace, Messages.messageErrorPatternOnlyLettersAndSpace);
        return;
      }
      const yearsOfDifference = Utilities.getYearsOfDifference(new Date(), this.date);
      if (yearsOfDifference < Constants.MINIMUM_YEARS_OF_STUDENT
      || yearsOfDifference > Constants.MAXIMUM_YEARS_OF_STUDENT) {
        Confirms.showErrorType(Messages.titleErrorMinimumYearsStudent, Messages.messageErrorMinimumAndMaximumYearsStudent);
        return;
      }
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
        if (Utilities.serverError(res)) {
          return;
        }
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
        if (Utilities.serverError(res)) {
          return;
        }
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.dialogRef.close(student);
      },
      error => {
        console.log(error);
        console.log(JSON.stringify(student));
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  onFileSelectedListener(event) {
    AppComponent.spinner.show();
    const selectedFiles = event.target.files;
    const file = selectedFiles.item(0);
    const fileExtension = "." + file.name.split(".").pop();
    const name =
      Math.random()
        .toString(36)
        .substring(7) +
      new Date().getTime() +
      fileExtension;

    const currentFileUpload = new FileUpload(file, name);
    const uploadTask = this.uploadService.pushFileToStorage(currentFileUpload, UploadService.basePathStudent);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        this.progressLoadImage = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
      },
      error => {
        // fail
        console.log(error);
        Confirms.showErrorType(Messages.titleErrorLoadImage, Messages.messageErrorLoadImage);
        AppComponent.spinner.hide();
      },
      () => {
        // success
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          currentFileUpload.url = downloadURL;
          this.urlImage = currentFileUpload.url;
          console.log(this.urlImage);
          AppComponent.spinner.hide();
        });
      }
    );
  }
}
