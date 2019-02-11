import {Component, Inject, OnInit} from '@angular/core';
import {Accounting, ViewValue} from '../../interfaces';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminAccountingComponent} from '../../admin-accounting/admin-accounting.component';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {AppComponent} from '../../app.component';
import {Confirms} from '../../util/Confirms';
import {Utilities} from '../../util/Utilities';
import {Messages} from '../../util/Messages';

@Component({
  selector: 'app-add-movement',
  templateUrl: './dialog-add-movement.component.html',
  styleUrls: ['./dialog-add-movement.component.css']
})
export class DialogAddMovementComponent implements OnInit {
  typesContributions: ViewValue[] = [
    {value: '0', viewValue: 'Ingreso'},
    {value: '1', viewValue: 'Egreso'},
    // {value: '2', viewValue: 'Ambos'}
  ];
  selectedType = this.typesContributions[0].viewValue;
  value = null;
  date = null;
  details = null;
  tittle = 'Agregar Movimiento';
  isDateNow = true;

  constructor(public dialogRef: MatDialogRef<AdminAccountingComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit) {
    if (this.dataEdit) {
      this.selectedType = this.dataEdit.tipo;
      this.value = this.dataEdit.valor;
      this.date = Utilities.getDateFromFormatString(this.dataEdit.fechaMovimiento);
      this.details = this.dataEdit.descripcionMovimiento;
      this.tittle = 'Editar Movimiento';
      this.isDateNow = false;
    }
  }

  ngOnInit() {
  }

  closeDialogAddMovement() {
    this.dialogRef.close();
  }

  registerMovement(event: Event) {
    if (this.value && (this.date || this.isDateNow)) {
      if (this.dataEdit) {
        this.edit();
      } else {
        this.add();
      }
    }
  }

  private getMovement() {
    let id = -1;
    if (this.dataEdit) {
      id = this.dataEdit.idMovimiento;
    }
    if (this.isDateNow) {
      this.date = new Date();
    }
    return {'idMovimiento': id, 'tipo': this.selectedType, 'valor': this.value, 'fechaMovimiento': Utilities.getFormatDate(this.date), 'descripcionMovimiento': this.details};
  }

  private edit() {
    AppComponent.spinner.show();
    const movement = this.getMovement();
    this.serviceQueries.update(Messages.urlMovement, movement).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, '');
        this.dialogRef.close(movement);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
      });
  }

  private add() {
    AppComponent.spinner.show();
    const movement = this.getMovement();
    this.serviceQueries.create(Messages.urlMovement, movement).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.dialogRef.close(movement);
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }
}
