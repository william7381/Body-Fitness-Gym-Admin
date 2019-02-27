import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminAddSubscriptionComponent} from '../../admin-add-subscription/admin-add-subscription.component';
import {Messages} from '../../util/Messages';
import {AppComponent} from '../../app.component';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {Confirms} from '../../util/Confirms';
import {Utilities} from '../../util/Utilities';
import {Constants} from '../../util/Constants';

@Component({
  selector: 'app-dialog-add-suscription',
  templateUrl: './dialog-add-subscription.component.html',
  styleUrls: ['./dialog-add-subscription.component.css']
})
export class DialogAddSubscriptionComponent implements OnInit, AfterViewInit {
  programs = null;
  selectedProgram;
  selectedProgramName;
  price;
  sessions;
  date;
  isDateSubscription = true;
  isPreview = false;
  tittle = 'Agragar Subscripcion';
  buttonCancelName = 'Cancelar';
  private auxChangeTrainer = true;
  private student = null;
  constants = Constants;
  utilities = Utilities;

  constructor(public dialogRef: MatDialogRef<AdminAddSubscriptionComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit) {
    this.student = this.dataEdit.student;
    if (this.dataEdit && this.dataEdit.dataPreview) {
      const object = this.dataEdit.dataPreview;
      this.price = object.precioSuscripcion;
      if (object.fechaFin) {
        this.date = Utilities.getDateFromFormatString(object.fechaFin);
      }
      this.sessions = object.sesiones;
      this.tittle = 'Editar Movimiento';
      if (!this.date) {
        this.isDateSubscription = false;
      }
      if (dataEdit.isPreview) {
        this.buttonCancelName = 'Cerrar';
        this.isPreview = true;
      }
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.updatePrograms();
  }

  updatePrograms() {
    const s = this.serviceQueries.read(Messages.urlAllServices);
    s.subscribe(res => {
        this.programs = res;
        this.selectedProgramName = this.programs[0].nombreServicio;
        this.selectedProgram = this.programs[0];
        this.auxChangeTrainer = true;
        if (this.dataEdit && this.dataEdit.dataPreview) {
          const object = this.dataEdit.dataPreview;
          this.selectedProgram = object.servicio;
          this.selectedProgramName = object.servicio.nombreServicio;
        }
      },
      error => {
        AppComponent.notifies.showError(Messages.titleErrorConnection, Messages.titleErrorGetPrograms);
      });
  }

  finishUpdateProgram() {
    this.auxChangeTrainer = true;
  }

  changeProgram(program) {
    // this.selectedProgram = program;
    if (this.auxChangeTrainer) {
      if (program.idServicio !== this.selectedProgram.idServicio) {
        this.selectedProgram = program;
      } else {
        this.auxChangeTrainer = true;
        return;
      }
    }
    this.auxChangeTrainer = false;
  }

  registerSubscription(event) {
    if (!this.selectedProgram) {
      Confirms.showErrorType(Messages.titleErrorClassNeedProgram, Messages.messageErrorClassNeed);
      return;
    }
    // if (this.programs && this.programs.length === 0) {
    //   Confirms.showErrorType(Messages.titleErrorClassNeedProgram, Messages.messageErrorClassNeed);
    //   return;
    // }
    if (this.isDateSubscription) {
      if (!this.date) {
        Confirms.showErrorType(Messages.titleErrorDate, Messages.messageErrorDateNeed);
        return;
      }
      if (this.date && !Utilities.compareDateMajor(this.date, new Date())) {
        Confirms.showErrorType(Messages.titleErrorDate, Messages.messageErrorDateMinor);
        return;
      }
    }
    if (this.price) {
      if (this.dataEdit && this.dataEdit.dataPreview) {
        this.edit();
        // this.editSubscription();
      } else {
        this.add();
        // this.addSubscription();
      }
    }
  }

  private getMovement() {
    let id = -1;
    const dateInit = new Date();
    if (this.dataEdit && this.dataEdit.dataPreview) {
      id = this.dataEdit.dataPreview.movimientoDeCaja.idMovimiento;
      return {'idMovimiento': id, 'tipo': 'Ingreso', 'valor': this.price, 'fechaMovimiento': Utilities.getFormatDate(dateInit), 'descripcionMovimiento': 'Subscripcion'};
    } else {
      return {'tipo': 'Ingreso', 'valor': this.price, 'fechaMovimiento': Utilities.getFormatDate(dateInit), 'descripcionMovimiento': 'Subscripcion'};
    }
  }

  private editSubscription() {
    AppComponent.spinner.show();
    const movement = this.getMovement();
    this.serviceQueries.update(Messages.urlMovement, movement).subscribe(
      res => {
        this.edit();
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
      });
  }

  private addSubscription() {
    AppComponent.spinner.show();
    const movement = this.getMovement();
    this.serviceQueries.create(Messages.urlMovement, movement).subscribe(
      res => {
        // @ts-ignore
        this.add();
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  private getSubscription() {
    let id = -1;
    const dateInit = Utilities.getFormatDate(new Date());
    // if (this.isDateSubscription && this.date) {
    //
    // } else if (this.sessions) {
    //
    // }
    if (this.dataEdit && this.dataEdit.dataPreview) {
      id = this.dataEdit.dataPreview.idSuscripcion;
    }
    const movement = this.getMovement();
    if (this.isDateSubscription) {
      if (this.dataEdit && this.dataEdit.dataPreview) {
        return {'idSuscripcion': id, 'fechaInicio': dateInit, 'fechaFin': Utilities.getFormatDate(this.date), 'precioSuscripcion': this.price, 'movimientoDeCaja': movement, 'servicio': this.selectedProgram};
      }
      return {'idSuscripcion': id, 'fechaInicio': dateInit, 'fechaFin': Utilities.getFormatDate(this.date), 'precioSuscripcion': this.price, 'movimientoDeCaja': movement/*, 'servicio': this.selectedProgram*/};
    } else {
      if (this.dataEdit && this.dataEdit.dataPreview) {
        return {'idSuscripcion': id, 'fechaInicio': dateInit, 'sesiones': this.sessions, 'precioSuscripcion': this.price, 'movimientoDeCaja': movement, 'servicio': this.selectedProgram};
      }
      return {'idSuscripcion': id, 'fechaInicio': dateInit, 'sesiones': this.sessions, 'precioSuscripcion': this.price, 'movimientoDeCaja': movement/*, 'servicio': this.selectedProgram*/};
    }
  }

  private edit() {
    AppComponent.spinner.show();
    const subscription = this.getSubscription();
    this.serviceQueries.update(Messages.urlSubscription, subscription).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, '');
        this.dialogRef.close(subscription);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
      });
  }

  private add() {
    AppComponent.spinner.show();
    const subscription = this.getSubscription();
    this.serviceQueries.create(Messages.urlSubscription + Messages.urlStudent + '/' + this.student.dniAlumno + Messages.urlService + '/' + this.selectedProgram.idServicio, subscription).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.dialogRef.close(subscription);
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  closeDialogAddSubscription() {
    this.dialogRef.close();
  }
}
