import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminProgramsComponent} from '../../admin-programs/admin-programs.component';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {PreviewObject} from '../../interfaces';
import {AppComponent} from '../../app.component';
import {Messages} from '../../util/Messages';
import {Confirms} from '../../util/Confirms';
import {Constants} from '../../util/Constants';

@Component({
  selector: 'app-add-question',
  templateUrl: './dialog-add-question.component.html',
  styleUrls: ['./dialog-add-question.component.css']
})
export class DialogAddQuestionComponent implements OnInit {
  name = null;
  description = null;
  title = 'Agregar Pregunta';
  nameButtonCancel = 'Cancelar';
  isPreview = false;

  constructor(public dialogRef: MatDialogRef<AdminProgramsComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit: PreviewObject) {
    if (this.dataEdit && this.dataEdit.dataPreview) {
      const object = this.dataEdit.dataPreview;
      this.name = object.nombrePregunta;
      this.description = object.descripcionPregunta;
      this.title = 'Editar Pregunta';
      if (this.dataEdit.isPreview) {
        this.isPreview = true;
        this.nameButtonCancel = 'Cerrar';
      }
    }
  }

  ngOnInit() {
  }

  registerQuestion(event) {
    if (this.name.match(Constants.regexOnlyLetterAndSpace) === null) {
      Confirms.showErrorType(Messages.titleErrorPatternOnlyLettersAndSpace, Messages.messageErrorPatternOnlyLettersAndSpace);
      return;
    }
    if (this.name) {
      if (this.dataEdit) {
        this.edit();
      } else {
        this.add();
      }
    }
  }

  private getQuestion() {
    let id = -1;
    if (this.dataEdit && this.dataEdit.dataPreview) {
      id = this.dataEdit.dataPreview.idPregunta;
    }
    return {'idPregunta': id, 'nombrePregunta': this.name, 'descripcionPregunta': this.description};
  }

  private edit() {
    AppComponent.spinner.show();
    const question = this.getQuestion();
    this.serviceQueries.update(Messages.urlQuestion, question).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, '');
        this.dialogRef.close(question);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
      });
  }

  private add() {
    AppComponent.spinner.show();
    const question = this.getQuestion();
    this.serviceQueries.create(Messages.urlQuestion, question).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.dialogRef.close(question);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  closeDialogAddQuestion() {
    this.dialogRef.close();
  }
}
