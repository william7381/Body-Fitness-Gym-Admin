import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { AdminProgramsComponent } from "../../admin-programs/admin-programs.component";
import { ServiceQueries } from "../../services/queries/service-queries.service";
import { PreviewObject } from "../../interfaces";
import { AppComponent } from "../../app.component";
import { Messages } from "../../util/Messages";
import { Confirms } from "../../util/Confirms";
import { Utilities } from "../../util/Utilities";
import { FileUpload } from "../../util/upload";
import { UploadService } from "../../services/upload-service/upload.service";
import * as firebase from "firebase";

@Component({
  selector: "app-add-news",
  templateUrl: "./dialog-add-news.component.html",
  styleUrls: ["./dialog-add-news.component.css"]
})
export class DialogAddNewsComponent implements OnInit {
  title = null;
  urlImage = "../../../assets/avatar.jpg";
  description = null;
  titleDialog = "Agregar Noticia";
  nameButtonCancel = "Cancelar";
  isPreview = false;
  selectedImage = null;
  progressLoadImage;

  constructor(
    public dialogRef: MatDialogRef<AdminProgramsComponent>,
    private serviceQueries: ServiceQueries,
    @Inject(MAT_DIALOG_DATA) private dataEdit: PreviewObject,
    public uploadService: UploadService
  ) {
    if (this.dataEdit && this.dataEdit.dataPreview) {
      const object = this.dataEdit.dataPreview;
      this.title = object.titular;
      this.urlImage = object.imagenNoticia;
      this.description = object.contenido;
      this.titleDialog = "Editar Noticia";
      if (this.dataEdit.isPreview) {
        this.isPreview = true;
        this.nameButtonCancel = "Cerrar";
      }
    }
  }

  ngOnInit() {}

  inFileSelected(event, imageAvatar) {
    this.selectedImage = window.URL.createObjectURL(event.target.files[0]);
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
    return {
      idNoticia: id,
      titular: this.title,
      imagenNoticia: this.urlImage,
      contenido: this.description
    };
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
        AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, "");
        this.dialogRef.close(news);
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(
          Messages.titleErrorEdit,
          Messages.messageErrorInternetConexion
        );
      }
    );
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
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, "");
        this.dialogRef.close(news);
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(
          Messages.titleErrorAdd,
          Messages.messageErrorInternetConexion
        );
      }
    );
  }

  closeDialogAddNews() {
    this.dialogRef.close();
  }

  onFileSelectedListener(event) {
    // muestra la imagen en el componente img
    const selectedFiles = event.target.files;
    const file = selectedFiles.item(0);
    const fileExtension = "." + file.name.split(".").pop();
    const name =
      Math.random()
        .toString(36)
        .substring(7) +
      new Date().getTime() +
      fileExtension;

    let currentFileUpload = new FileUpload(file, name);
    const uploadTask = this.uploadService.pushFileToStorage(currentFileUpload);
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
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          currentFileUpload.url = downloadURL;
          this.urlImage = currentFileUpload.url;
          console.log(this.urlImage);
        });
      }
    );
  }
}
