
export interface User {
  userName: string;
}

export interface ViewValue {
  value: string;
  viewValue: string;
}

export interface PreviewObject {
  dataPreview;
  isPreview: boolean;
}

export interface PreviewObjectSubscription {
  dataPreview;
  student;
  isPreview: boolean;
}

export interface Accounting {
  idMovimiento: number;
  descripcionMovimiento: string;
  tipo: string;
  valor: number;
  fechaMovimiento: string;
}
