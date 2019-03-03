import { Injectable } from '@angular/core';
import { FileUpload } from '../../util/upload';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public static readonly basePathNews = '/uploadsNews';
  public static readonly basePathStudent = '/uploadsStudents';
  public static readonly basePathTrainer = '/uploadsTrainers';
  private basePathProgress = '/progress';

  constructor() {}

  pushFileToStorage(fileUpload: FileUpload, basePath: string) {
    const storageRef = firebase.storage().ref();
    console.log(storageRef);
    return storageRef
      .child(`${basePath}/${fileUpload.name}`)
      .put(fileUpload.file);
  }

  pushFileToStorageProgress(fileUpload: FileUpload) {
    const storageRef = firebase.storage().ref();
    console.log(storageRef);
    return storageRef
      .child(`${this.basePathProgress}/${localStorage.getItem("idAlumno")}/${fileUpload.name}`)
      .put(fileUpload.file);
  }

  deleteFileUpload(name: string, basePath: string) {
    this.deleteFileStorage(name, basePath);
  }

  private deleteFileStorage(name: string, basePath: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${basePath}/${name}`).delete();
  }
}
