import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {DialogAddMovementComponent} from '../dialogs/add-movement/dialog-add-movement.component';
import {RoutersApp} from '../util/RoutersApp';
import {Router} from '@angular/router';
import {Messages} from '../util/Messages';
import {Utilities} from '../util/Utilities';
import {AppComponent} from '../app.component';
import {ServiceQueries} from '../services/queries/service-queries.service';
import {Confirms} from '../util/Confirms';
import {ServiceDataTemp} from '../services/temp/service-temp.service';
import {PreviewObject} from '../interfaces';
import {DialogAddProgramComponent} from '../dialogs/add-program/dialog-add-program.component';
import {DialogAddClassComponent} from '../dialogs/add-class/dialog-add-class.component';

@Component({
  selector: 'app-admin-classes',
  templateUrl: './admin-classes.component.html',
  styleUrls: ['./admin-classes.component.css']
})
export class AdminClassesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['position', /*'tipo',*/ 'entrenador', 'numeroCupos', 'dia', 'horaInicio', 'horaFin', 'descripcion', 'options'];
  dataSource = new MatTableDataSource();
  isLoadingTable = true;

  constructor(public dialog: MatDialog, private router: Router, private serviceQueries: ServiceQueries, private serviceSubscription: ServiceDataTemp) {
    this.updateTable();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  search(filterValue: string) {
    if (filterValue) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  updateTable() {
    this.dataSource.data = [];
    this.isLoadingTable = true;
    const s = this.serviceQueries.read(Messages.urlAllClasses);
    s.subscribe(res => {
        // @ts-ignore
        this.dataSource.data = res;
        this.isLoadingTable = false;
      },
      error => {
        AppComponent.notifies.showErrorWithMethod(Messages.titleErrorConnection, Messages.titleErrorGetDataSource, this, this.updateTable);
        this.isLoadingTable = false;
      });
  }

  // add() {
  //   this.serviceSubscription.selectedClass = null;
  //   this.serviceSubscription.previewClass = false;
  //   this.router.navigateByUrl(RoutersApp.completeAddScheduleClass);
  // }

  // preview(element) {
  //   this.serviceSubscription.selectedClass = element;
  //   this.serviceSubscription.previewClass = true;
  //   this.router.navigateByUrl(RoutersApp.completeAddScheduleClass);
  // }
  //
  // edit(element) {
  //   this.serviceSubscription.selectedClass = element;
  //   this.serviceSubscription.previewClass = false;
  //   this.router.navigateByUrl(RoutersApp.completeAddScheduleClass);
  // }

  remove(element) {
    Confirms.showChooserOption(Messages.titleChooseRemove, Messages.warning).then((response) => {
      if (response.value) {
        AppComponent.spinner.show();
        this.serviceQueries.delete(Messages.urlClass, element.idClase).subscribe(
          res => {
            this.updateTable();
            AppComponent.notifies.showSuccess(Messages.titleSuccessRemove, '');
            AppComponent.spinner.hide();
          },
          error => {
            AppComponent.spinner.hide();
            Confirms.showErrorType(Messages.titleErrorRemove, Messages.messageErrorInternetConexion);
          },
        );
      }
    });
  }

  preview(element) {
    const dataEdit: PreviewObject = {dataPreview: element, isPreview: true};
    const dialogRef = this.dialog.open(DialogAddClassComponent, {
      width: '30%',
      height: 'max-content',
      data: dataEdit
    });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.updateTable();
    //   }
    // });
    this.showScreenDark(dialogRef);
  }

  private showScreenDark(dialogRef) {
    if (this.isScreenLow()) {
      dialogRef.updateSize('70%', 'max-content');
    }
    this.setEventOpacityScreen(dialogRef);
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

  add() {
    const dialogRef = this.dialog.open(DialogAddClassComponent, {
      width: '30%',
      height: 'max-content'
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
    const dialogRef = this.dialog.open(DialogAddClassComponent, {
      width: '30%',
      height: 'max-content',
      data: dataEdit
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef);
  }

  ngOnDestroy(): void {
    AppComponent.notifies.clear();
  }

  openComponentSchedule(element) {
    this.serviceSubscription.selectedClass = element;
    this.router.navigateByUrl(RoutersApp.completeAddScheduleClass);
  }
}
