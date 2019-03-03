import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminProgramsComponent} from '../../admin-programs/admin-programs.component';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {PreviewObject} from '../../interfaces';
import {Messages} from '../../util/Messages';
import {AppComponent} from '../../app.component';
import {Confirms} from '../../util/Confirms';
import {RoutersApp} from '../../util/RoutersApp';
import {Router} from '@angular/router';
import {Constants} from '../../util/Constants';

@Component({
  selector: 'app-add-class',
  templateUrl: './dialog-add-class.component.html',
  styleUrls: ['./dialog-add-class.component.css']
})
export class DialogAddClassComponent implements OnInit, AfterViewInit {
  programs;
  selectedProgramName;
  selectedProgram;
  trainers = null;
  selectedTrainerName;
  selectedTrainer;
  numberQuotas = null;
  description = null;
  title = 'Agregar Clase';
  nameButtonCancel = 'Cancelar';
  isPreview = false;
  private auxChangeTrainer = true;
  private auxChangeProgram = true;
  private selectedClass = null;
  constants = Constants;

  constructor(private router: Router, public dialogRef: MatDialogRef<AdminProgramsComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit: PreviewObject) {
    if (this.dataEdit && this.dataEdit.dataPreview) {
      const object = this.selectedClass = this.dataEdit.dataPreview;
      this.numberQuotas = object.numeroCupos;
      this.description = object.descripcion;
      this.title = 'Editar Clase';
      if (this.dataEdit.isPreview) {
        this.isPreview = true;
        this.nameButtonCancel = 'Cerrar';
      }
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.updateTrainers();
  }

  updateTrainers() {
    const s = this.serviceQueries.read(Messages.urlAllTrainers);
    s.subscribe(res => {
        this.trainers = res;
        this.selectedTrainerName = this.trainers[0].nombreEntrenador;
        this.selectedTrainer = this.trainers[0];
        this.programs = this.selectedTrainer.entrenadorServicio;
        if (this.programs && this.programs.length > 0) {
          this.selectedProgram = this.programs[0];
          this.selectedProgramName = this.selectedProgram.nombreServicio;
        }
        this.updatePrograms(this.selectedTrainer);
        this.auxChangeTrainer = true;
        // cargar programa para edit y preview
        if (this.selectedClass) {
          const trainer = this.selectedClass.entrendor;
          this.selectedTrainer = trainer;
          this.selectedTrainerName = trainer.nombreEntrenador;
          this.programs = trainer.entrenadorServicio;
          const service = this.selectedClass.servicio;
          this.selectedProgram = service;
          this.selectedProgramName = service.nombreServicio;
          // console.log(JSON.stringify(this.selectedClass));
          // console.log(JSON.stringify(service));
          // console.log(JSON.stringify(this.selectedProgram));
          // console.log(JSON.stringify(this.selectedProgramName));
        }
      },
      error => {
        AppComponent.notifies.showError(Messages.titleErrorConnection, Messages.titleErrorGetTrainers);
      });
  }

  finishUpdateProgramsTrainer() {
    this.auxChangeTrainer = true;
  }

  updatePrograms(trainer) {
    if (this.auxChangeTrainer) {
      if (trainer.dniEntrenador !== this.selectedTrainer.dniEntrenador) {
        this.selectedTrainer = trainer;
        if (this.trainers) {
          this.programs = trainer.entrenadorServicio;
          if (this.programs && this.programs.length > 0) {
            this.selectedProgramName = this.programs[0].nombreServicio;
            this.selectedProgram = this.programs[0];
          }
        }
      } else {
        this.auxChangeTrainer = true;
        return;
      }
    }
    this.auxChangeTrainer = false;
    // if (this.auxChangeTrainer === 2) {
    //   this.auxChangeTrainer = 0;
    // }
  }

  finishUpdateProgram() {
    this.auxChangeProgram = true;
  }

  changeProgram(program) {
    // this.selectedProgram = program;
    if (this.auxChangeProgram) {
      if (program.idServicio !== this.selectedProgram.idServicio) {
        this.selectedProgram = program;
      } else {
        this.auxChangeProgram = true;
        return;
      }
    }
    this.auxChangeProgram = false;
  }

  getClass() {
    let id = -1;
    if (this.selectedClass) {
      id = this.selectedClass.idClase;
      return {'idClase': id, 'descripcion': this.description, 'numeroCupos': this.numberQuotas, 'entrendor': this.selectedTrainer, 'servicio': this.selectedProgram, 'horarioClase': this.selectedClass.horarioClase};
    } else {
      return {'idClase': id, 'descripcion': this.description, 'numeroCupos': this.numberQuotas/*, 'entrendor': this.selectedTrainer, 'servicio': this.selectedProgramName, 'asistencia': this.students.data,*/};
    }
  }

  registerClass($event) {
    if (!this.selectedTrainer) {
      Confirms.showErrorType(Messages.titleErrorClassNeedTrainer, Messages.messageErrorClassNeed);
      return;
    }
    if (!this.selectedProgram) {
      Confirms.showErrorType(Messages.titleErrorClassNeedProgram, Messages.messageErrorClassNeed);
      return;
    }
    // if (this.trainers && this.trainers.length === 0) {
    //   Confirms.showErrorType(Messages.titleErrorClassNeedTrainer, Messages.messageErrorClassNeed);
    //   return;
    // }
    // if (this.programs && this.programs.length === 0) {
    //   Confirms.showErrorType(Messages.titleErrorClassNeedProgram, Messages.messageErrorClassNeed);
    //   return;
    // }
    if (this.numberQuotas && this.numberQuotas > 0) {
      if (!this.selectedClass) {
        this.addClass();
      } else {
        this.editClass();
      }
    } else {
      Confirms.showErrorType(Messages.titleErrorNeedQuotas, Messages.messageErrorNeedQuotas);
    }
  }

  private editClass() {
    AppComponent.spinner.show();
    const addClass = this.getClass();
    this.serviceQueries.update(Messages.urlClass, addClass).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, '');
        this.dialogRef.close(addClass);
      },
      error => {
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
        console.log(error);
      });
  }

  private addClass() {
    AppComponent.spinner.show();
    const addClass = this.getClass();
    this.serviceQueries.create(Messages.urlClass + Messages.urlService + '/' + this.selectedProgram.idServicio + Messages.urlTrainer + '/' + this.selectedTrainer.dniEntrenador, addClass).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessAdd, '');
        this.dialogRef.close(addClass);
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorAdd, Messages.messageErrorInternetConexion);
      });
  }

  closeAddClass() {
    this.dialogRef.close();
  }
}
