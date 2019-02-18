import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminProgramsComponent} from '../../admin-programs/admin-programs.component';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {PreviewObject} from '../../interfaces';
import {AppComponent} from '../../app.component';
import {Messages} from '../../util/Messages';
import {Confirms} from '../../util/Confirms';
import {Utilities} from '../../util/Utilities';

@Component({
  selector: 'app-add-news',
  templateUrl: './dialog-add-news.component.html',
  styleUrls: ['./dialog-add-news.component.css']
})
export class DialogAddNewsComponent implements OnInit {
  title = null;
  urlImage = null;
  description = null;
  titleDialog = 'Agregar Noticia';
  nameButtonCancel = 'Cancelar';
  isPreview = false;
  selectedImage = null;

  constructor(public dialogRef: MatDialogRef<AdminProgramsComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit: PreviewObject) {
    if (this.dataEdit && this.dataEdit.dataPreview) {
      const object = this.dataEdit.dataPreview;
      this.title = object.titular;
      this.urlImage = object.imagenNoticia;
      this.description = object.contenido;
      this.titleDialog = 'Editar Noticia';
      if (this.dataEdit.isPreview) {
        this.isPreview = true;
        this.nameButtonCancel = 'Cerrar';
      }
    }
  }

  ngOnInit() {
  }

  inFileSelected(event, imageAvatar) {
    this.selectedImage = '../../assets/' + event.target.files[0].name;
    imageAvatar.src = this.selectedImage;
  }

  registerNews(event) {
    if (this.title) {
      if (this.dataEdit) {
        this.edit();
      } else {
        this.add();
      }
    }
  }

  private getNews() {
    let id = -1;
    if (this.dataEdit && this.dataEdit.dataPreview) {
      id = this.dataEdit.dataPreview.idNoticia;
    }
    return {'idNoticia': id, 'titular': this.title, 'imagenNoticia': this.urlImage, 'contenido': this.description};
  }

  private edit() {
    AppComponent.spinner.show();
    const news = this.getNews();
    this.serviceQueries.update(Messages.urlNews, news).subscribe(
      res => {
        AppComponent.spinner.hide();
        if (Utilities.serverError(res)) {
          return;
        }
        AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, '');
        this.dialogRef.close(news);
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
      });
  }

  private add() {
    AppComponent.spinner.show();
    const news = this.getNews();
    this.serviceQueries.create(Messages.urlNews, news).subscribe(
      res => {
        AppComponent.spinner.hide();
        if (Utilities.serverError(res)) {
          return;
        }
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.dialogRef.close(news);
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  closeDialogAddNews() {
    this.dialogRef.close();
  }
}
