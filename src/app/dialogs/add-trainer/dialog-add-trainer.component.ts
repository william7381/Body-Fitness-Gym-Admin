import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {AdminTrainersComponent} from '../../admin-trainers/admin-trainers.component';
import {MAT_DIALOG_DATA, MatDialogRef, MatListOption} from '@angular/material';
import {PreviewObject, ViewValue} from '../../interfaces';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {Messages} from '../../util/Messages';
import {AppComponent} from '../../app.component';
import {Confirms} from '../../util/Confirms';
import {SelectionModel} from '@angular/cdk/collections';
import {Constants} from '../../util/Constants';
import { FileUpload } from '../../util/upload';
import * as firebase from 'firebase';
import {UploadService} from '../../services/upload-service/upload.service';
import {Utilities} from '../../util/Utilities';

@Component({
  selector: 'app-dialog-add-trainer',
  templateUrl: './dialog-add-trainer.component.html',
  styleUrls: ['./dialog-add-trainer.component.css']
})
export class DialogAddTrainerComponent implements OnInit {

  typesContributions: ViewValue[] = [
    {value: '0', viewValue: 'Ingreso'},
    {value: '1', viewValue: 'Egreso'},
    {value: '2', viewValue: 'Ambos'}
  ];
  selectedType = this.typesContributions[0].value;
  value = null;
  urlImage = '../../assets/avatar.jpg';
  name = null;
  dni = null;
  telephone = null;
  email = null;
  programs: string[] = [];
  // items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
  selectedImage = null;

  title = 'Agregar Entrenador';
  nameButtonCancel = 'Cancelar';
  isLoadingPrograms: boolean;
  isPreview = false;
  displayedColumnsPrograms: string[] = ['name', 'select'];
  tempPrograms = [];
  selection = new SelectionModel(true, []);
  progressLoadImage;
  constants = Constants;
  utilities = Utilities;

  constructor(public dialogRef: MatDialogRef<AdminTrainersComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit: PreviewObject, public uploadService: UploadService) {
    this.updatePrograms();
    if (this.dataEdit && this.dataEdit.dataPreview) {
      const object = this.dataEdit.dataPreview;
      this.urlImage = object.urlImagenEntrenador;
      this.name = object.nombreEntrenador;
      this.dni = object.dniEntrenador;
      this.telephone = object.telefonoEntrenador;
      this.email = object.emailEntrenador;
      this.tempPrograms = object.entrenadorServicio;
      this.title = 'Editar Programa';
      if (this.dataEdit.isPreview) {
        this.isPreview = true;
        this.nameButtonCancel = 'Cerrar';
      }
    }
  }

  private updatePrograms() {
    this.programs = [];
    this.isLoadingPrograms = true;
    const s = this.serviceQueries.read(Messages.urlAllServices);
    s.subscribe(res => {
        // @ts-ignore
        this.programs = res;
        this.programs.forEach(row => {
          for (const program of this.tempPrograms) {
            // @ts-ignore
            if (program.idServicio === row.idServicio) {
              this.selection.selected.push(row);
              this.selection.select(row);
            }
          }
        });
        this.isLoadingPrograms = false;
      },
      error => {
        AppComponent.notifies.showError(Messages.titleErrorConnection, Messages.titleErrorGetPrograms);
        this.isLoadingPrograms = false;
      });
  }

  ngOnInit() {
  }

  inFileSelected(event, imageAvatar) {
    this.selectedImage = window.URL.createObjectURL(event.target.files[0]);
    imageAvatar.src = this.selectedImage;
  }

  private getTrainer() {
    // let id = -1;
    // if (this.dataEdit && this.dataEdit.dataPreview) {
    //   id = this.dataEdit.dataPreview.idEntrenador;
    // }
    return {'dniEntrenador': this.dni, 'urlImagenEntrenador': this.urlImage, 'nombreEntrenador': this.name, 'usuarioEntrenador': this.dni, 'contraseniaEntrenador': this.telephone, 'telefonoEntrenador': this.telephone, 'emailEntrenador': this.email, 'entrenadorServicio': this.selection.selected};
  }

  closeDialogAddTrainer() {
    this.dialogRef.close();
  }

  registerTrainer(event: Event) {
    if (this.name && this.dni && this.telephone && this.selection.selected.length > 0) {
      if (this.name.match(Constants.regexOnlyLetterAndSpace) === null) {
        Confirms.showErrorType(Messages.titleErrorPatternOnlyLettersAndSpace, Messages.messageErrorPatternOnlyLettersAndSpace);
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
    const program = this.getTrainer();
    this.serviceQueries.update(Messages.urlTrainer, program).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, '');
        this.dialogRef.close(program);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
      });
  }

  private add() {
    AppComponent.spinner.show();
    const program = this.getTrainer();
    this.serviceQueries.create(Messages.urlTrainer, program).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.dialogRef.close(program);
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.programs.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.programs.forEach(row => this.selection.select(row));
  }

  onFileSelectedListener(event) {
    // muestra la imagen en el componente img
    const selectedFiles = event.target.files;
    const file = selectedFiles.item(0);
    const fileExtension = '.' + file.name.split('.').pop();
    const name =
      Math.random()
        .toString(36)
        .substring(7) +
      new Date().getTime() +
      fileExtension;

    const currentFileUpload = new FileUpload(file, name);
    const uploadTask = this.uploadService.pushFileToStorage(
      currentFileUpload
    );
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
      },
      () => {
        // success
        currentFileUpload.url = uploadTask.snapshot.downloadURL;
        this.urlImage = currentFileUpload.url;
      }
    );
  }
}
