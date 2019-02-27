import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminProgramsComponent} from '../../admin-programs/admin-programs.component';
import {PreviewObject, ViewValue} from '../../interfaces';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {Utilities} from '../../util/Utilities';
import {AppComponent} from '../../app.component';
import {Messages} from '../../util/Messages';
import {Confirms} from '../../util/Confirms';
import {Constants} from '../../util/Constants';

@Component({
  selector: 'app-add-program',
  templateUrl: './dialog-add-program.component.html',
  styleUrls: ['./dialog-add-program.component.css']
})
export class DialogAddProgramComponent implements OnInit {
  // typesPrograms: ViewValue[] = [
  //   {value: '0', viewValue: 'Sppinning'},
  //   {value: '1', viewValue: 'Cardio'},            // Debe venir desde la base de datos
  //   {value: '2', viewValue: '---'}
  // ];
  // selectedType = null;
  name = null;
  price = null;
  description = null;
  title = 'Agregar Programa';
  nameButtonCancel = 'Cancelar';
  isPreview = false;
  constants = Constants;
  utilities = Utilities;

  constructor(public dialogRef: MatDialogRef<AdminProgramsComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit: PreviewObject) {
    if (this.dataEdit && this.dataEdit.dataPreview) {
      const object = this.dataEdit.dataPreview;
      this.name = object.nombreServicio;
      this.price = object.precio;
      this.description = object.descripcionServicio;
      this.title = 'Editar Programa';
      if (this.dataEdit.isPreview) {
        this.isPreview = true;
        this.nameButtonCancel = 'Cerrar';
      }
    }
  }

  ngOnInit() {
  }

  registerProgram(event) {
    if (this.name && this.price) {
      if (this.name.match(Constants.regexOnlyLetterAndSpace) === null) {
        Confirms.showErrorType(Messages.titleErrorPatternOnlyLettersAndSpace, Messages.messageErrorPatternOnlyLettersAndSpace);
        return;
      }
      if (this.dataEdit) {
        this.edit();
      } else {
        this.add();
      }
    }
  }

  private getProgram() {
    let id = -1;
    if (this.dataEdit && this.dataEdit.dataPreview) {
      id = this.dataEdit.dataPreview.idServicio;
    }
    return {'idServicio': id, 'nombreServicio': this.name, 'precio': this.price, 'descripcionServicio': this.description};
  }

  private edit() {
    AppComponent.spinner.show();
    const program = this.getProgram();
    this.serviceQueries.update(Messages.urlService, program).subscribe(
      res => {
        AppComponent.spinner.hide();
        if (res) {
          if (Utilities.serverError(res)) {
            return;
          }
          AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, '');
          this.dialogRef.close(program);
        }
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
      });
  }

  private add() {
    AppComponent.spinner.show();
    const program = this.getProgram();
    this.serviceQueries.create(Messages.urlService, program).subscribe(
      res => {
        AppComponent.spinner.hide();
        if (res) {
          if (Utilities.serverError(res)) {
            return;
          }
          AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
          this.dialogRef.close(program);
        }
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  closeDialogAddProgram() {
    this.dialogRef.close();
  }
}
