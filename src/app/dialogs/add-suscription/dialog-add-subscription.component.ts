import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import { ViewValue } from '../../interfaces';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { AdminAddStudentsComponent } from '../../admin-add-students/admin-add-students.component';
import {Messages} from '../../util/Messages';
import {AppComponent} from '../../app.component';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {Confirms} from '../../util/Confirms';
import {Utilities} from '../../util/Utilities';
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
  isPreview;
  tittle = 'Agragar Susbscripcion';
  buttonSuccessName = 'Agregar';
  buttonCancelName = 'Cancelar';
  private auxChangeTrainer = true;

  constructor(public dialogRef: MatDialogRef<AdminAddStudentsComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit) {
    if (this.dataEdit) {
      this.price = this.dataEdit.precioSuscripcion;
      this.date = this.dataEdit.fechaFin;
      this.sessions = this.dataEdit.sesiones;
      this.tittle = 'Editar Movimiento';
      this.buttonSuccessName = 'Editar';
      if (this.price) {
        this.isDateSubscription = false;
      }
      if (dataEdit.isPreview) {
        this.buttonCancelName = 'Cerrar';
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
        if (this.dataEdit) {
          this.selectedProgram = this.dataEdit.servicio;
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
    this.selectedProgram = program;
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
    if (this.programs && this.programs.length === 0) {
      Confirms.showErrorType(Messages.titleErrorClassNeedProgram, Messages.messageErrorClassNeed);
      return;
    }
    if (this.isDateSubscription) {
      if (this.date && !Utilities.compareDateMajor(this.date, new Date())) {
        Confirms.showErrorType(Messages.titleErrorDate, Messages.messageErrorDateMinor);
        return;
      }
    }
    if (this.price) {
      if (this.dataEdit) {
        this.editMovement();
      } else {
        this.addMovement();
      }
    }
  }

  private getMovement() {
    let id = -1;
    if (this.dataEdit) {
      id = this.dataEdit.movimientoDeCaja.idMovimiento;
    }
    const dateInit = new Date();
    return {'idMovimiento': id, 'tipo': 'Ingreso', 'valor': this.price, 'fechaMovimiento': Utilities.getFormatDate(dateInit), 'descripcionMovimiento': 'Subscripcion'};
  }

  private editMovement() {
    AppComponent.spinner.show();
    const movement = this.getMovement();
    this.serviceQueries.update(Messages.urlMovement, movement).subscribe(
      res => {
        this.edit(res);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
      });
  }

  private addMovement() {
    AppComponent.spinner.show();
    const movement = this.getMovement();
    this.serviceQueries.create(Messages.urlMovement, movement).subscribe(
      res => {
        // @ts-ignore
        this.add(res);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  private getSubscription(movement) {
    let id = -1;
    const dateInit = Utilities.getFormatDate(new Date());
    if (this.isDateSubscription && this.date) {

    } else if (this.sessions) {

    }
    if (this.dataEdit) {
      id = this.dataEdit.idSuscripcion;
    }
    if (this.isDateSubscription) {
      return {'idSuscripcion': id, 'fechaInicio': dateInit, 'fechaFin': this.date, 'precioSuscripcion': this.price, 'movimientoDeCaja': movement, 'servicio': this.selectedProgram};
    } else {
      return {'idSuscripcion': id, 'fechaInicio': dateInit, 'sesiones': this.sessions, 'precioSuscripcion': this.price, 'movimientoDeCaja': movement, 'servicio': this.selectedProgram};
    }
  }

  private edit(movement) {
    const subscription = this.getSubscription(movement);
    this.serviceQueries.update(Messages.urlMovement, subscription).subscribe(
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

  private add(movement) {
    const subscription = this.getSubscription(movement);
    this.serviceQueries.create(Messages.urlSubscripcion, subscription).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.dialogRef.close(subscription);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  closeDialogAddSubscription() {
    this.dialogRef.close();
  }
}
