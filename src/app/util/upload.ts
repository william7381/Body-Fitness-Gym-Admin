export class FileUpload {

  key: string;
  name: string;
  url: string;
  file: File;

  constructor(file: File,name) {
    this.file = file;
    this.name=name;
  }
}
