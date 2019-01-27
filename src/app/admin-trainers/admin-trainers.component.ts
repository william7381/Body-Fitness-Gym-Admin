import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {DialogAddMovementComponent} from '../dialogs/add-movement/dialog-add-movement.component';
import {DialogAddTrainerComponent} from '../dialogs/add-trainer/dialog-add-trainer.component';
import {Messages} from '../util/Messages';
import {Utilities} from '../util/Utilities';
import {AppComponent} from '../app.component';
import {ServiceQueries} from '../services/queries/service-queries.service';
import {Confirms} from '../util/Confirms';
import {PreviewObject} from '../interfaces';
import {DialogAddProgramComponent} from '../dialogs/add-program/dialog-add-program.component';

@Component({
  selector: 'app-admin-trainers',
  templateUrl: './admin-trainers.component.html',
  styleUrls: ['./admin-trainers.component.css']
})
export class AdminTrainersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['position', 'nombre', 'dni', 'programas', 'telefono', 'email', 'options'];
  dataSource = new MatTableDataSource();
  isLoadingTable = true;

  constructor(public dialog: MatDialog, private serviceQueries: ServiceQueries) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.updateTable();
    this.dataSource.paginator = this.paginator;
  }

  updateTable() {
    this.dataSource.data = [];
    this.isLoadingTable = true;
    const m = this.serviceQueries.read(Messages.urlAllTrainers);
    m.subscribe(res => {
        // @ts-ignore
        this.dataSource.data = res;
        this.isLoadingTable = false;
      },
      error => {
        AppComponent.notifies.showError(Messages.titleErrorConnection, Messages.titleErrorGetDataSource);
        this.isLoadingTable = false;
      });
  }

  search(filterValue: string) {
    if (filterValue) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  preview(element) {
    const dataEdit: PreviewObject = {dataPreview: element, isPreview: true};
    const dialogRef = this.dialog.open(DialogAddTrainerComponent, {
      width: '30%',
      height: '90%',
      data: dataEdit
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef);
  }

  edit(element) {
    const dataEdit: PreviewObject = {dataPreview: element, isPreview: false};
    const dialogRef = this.dialog.open(DialogAddTrainerComponent, {
      width: '30%',
      height: '90%',
      data: dataEdit
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef);
  }

  remove(element) {
    Confirms.showChooserOption(Messages.titleChooseRemove, Messages.warning).then((response) => {
      if (response.value) {
        AppComponent.spinner.show();
        this.serviceQueries.delete(Messages.urlTrainer, element.idEntrenador).subscribe(
          res => {
            this.updateTable();
            AppComponent.notifies.showSuccess(Messages.titleSuccessRemove, '');
            AppComponent.spinner.hide();
          },
          error => {
            // console.log(error);
            AppComponent.spinner.hide();
            Confirms.showErrorType(Messages.titleErrorRemove, Messages.messageErrorInternetConexion);
          },
        );
      }
    });
  }

  openDialogAddTrainer() {
    const dialogRef = this.dialog.open(DialogAddTrainerComponent, {
      width: '35%',
      height: '90%',
    });
    this.showScreenDark(dialogRef);
  }

  private setEventOpacityScreen(dialogRef) {
    const divMain = document.getElementById('div-main');
    // events for opacity screen
    this.setOpacityScreenLight(divMain);
    // events for leave the screen regular
    dialogRef.beforeClosed().subscribe(result => {
      this.setOpacityScreenRegular(divMain);
    });
  }

  private setOpacityScreenLight(divMain: HTMLElement) {
    // @ts-ignore
    divMain.style = 'filter: alpha(opacity=0.1); /* internet explorer */\n' +
      '  -khtml-opacity: 0.1;      /* khtml, old safari */\n' +
      '  -moz-opacity: 0.1;      /* mozilla, netscape */\n' +
      '  opacity: 0.1;      /* fx, safari, opera */';
  }

  private setOpacityScreenRegular(divMain: HTMLElement) {
    // @ts-ignore
    divMain.style = 'filter: alpha(opacity=1); /* internet explorer */\n' +
      '  -khtml-opacity: 1;      /* khtml, old safari */\n' +
      '  -moz-opacity: 1;      /* mozilla, netscape */\n' +
      '  opacity: 1;      /* fx, safari, opera */';
  }

  isScreenLow(): boolean {
    return window.screen.width < 900;
  }

  getListProgramNames(entrenadorServicio: any[]) {
    let listPrograms = '';
    let index = 0;
    for (const program of entrenadorServicio) {
      listPrograms += program.nombreServicio;
      index += 1;
      if (index !== entrenadorServicio.length) {
        listPrograms += ', ';
      }
    }
    return listPrograms;
  }

  private showScreenDark(dialogRef) {
    if (this.isScreenLow()) {
      dialogRef.updateSize('70%', '90%');
    }
    this.setEventOpacityScreen(dialogRef);
  }
}
