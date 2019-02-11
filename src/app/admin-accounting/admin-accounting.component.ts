import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {ViewValue} from '../interfaces';
import {DialogAddMovementComponent} from '../dialogs/add-movement/dialog-add-movement.component';
import {ServiceQueries} from '../services/queries/service-queries.service';
import {Confirms} from '../util/Confirms';
import {AppComponent} from '../app.component';
import {Messages} from '../util/Messages';
import {Utilities} from '../util/Utilities';

export interface TypeContribution {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-admin-accounting',
  templateUrl: './admin-accounting.component.html',
  styleUrls: ['./admin-accounting.component.css'],
})
export class AdminAccountingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['posicion', 'tipo', 'fecha', 'valor', 'descripcion', 'options'];
  dataSource = new MatTableDataSource();
  typesContributions: ViewValue[] = [
    {value: '0', viewValue: 'Ingreso'},
    {value: '1', viewValue: 'Egreso'},
    {value: '2', viewValue: 'Todos'}
  ];
  selectedContribution = this.typesContributions[0].viewValue;
  dateToday = null;
  selectedDateFrom = null;
  selectedDateUntil = null;
  selectedImage = null;
  isLoadingTable = true;
  // date = new FormControl(new Date().setTime(1547614800000));

  constructor(public dialog: MatDialog, private serviceQueries: ServiceQueries) {
    // this.selectedDateUntil.setTime(1548046800000);
    this.dateToday = new Date();
    this.selectedDateFrom = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth(), this.dateToday.getDate());
    this.selectedDateUntil = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth(), this.dateToday.getDate());
  }

  updateTable() {
    this.dataSource.data = [];
    this.isLoadingTable = true;
    const m = this.serviceQueries.read(Messages.urlAllMovements);
    m.subscribe(res => {
        // const movements = Utilities.parseToJson(m);
        // movements.forEach(element => {
        //   for (const object of element) {
        //     this.dataSource.data.push(object);
        //   }
        //   this.dataSource._updateChangeSubscription();
        // });
        // @ts-ignore
        this.dataSource.data = res;
        this.isLoadingTable = false;
      },
      error => {
        // AppComponent.notifies.showError(Messages.titleErrorConnection, Messages.titleErrorGetDataSource);
        AppComponent.notifies.showErrorWithMethod(Messages.titleErrorConnection, Messages.titleErrorGetDataSource, this, this.updateTable);
        this.isLoadingTable = false;
    });
  }

  addMovement() {
    const dialogRef = this.dialog.open(DialogAddMovementComponent, {
      width: '30%',
      height: 'max-content'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // this.dataSource.data.push(res);
        // this.dataSource._updateChangeSubscription();
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef);
  }

  editMovement(element) {
    const dialogRef = this.dialog.open(DialogAddMovementComponent, {
      width: '30%',
      height: 'max-content',
      data: element
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // // @ts-ignore
        // const itemIndex = this.dataSource.data.findIndex(item => item.idMovimiento === res.idMovimiento);
        // this.dataSource.data[itemIndex] = res;
        // this.dataSource._updateChangeSubscription();
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef);
  }

  removeMovement(element) {
    Confirms.showChooserOption(Messages.titleChooseRemove, Messages.warning).then((response) => {
      if (response.value) {
        AppComponent.spinner.show();
        this.serviceQueries.delete(Messages.urlMovement, element.idMovimiento).subscribe(
          res => {
            // this.updateTable();
            // Confirms.showTopRight(Messages.titleSuccessRemove, Messages.success);
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

  private showScreenDark(dialogRef) {
    if (this.isScreenLow()) {
      dialogRef.updateSize('70%', 'max-content');
    }
    this.setEventOpacityScreen(dialogRef);
  }

  ngOnInit() {

  }

  printReport() {

  }

  filter(event) {
    if (this.selectedContribution && this.selectedDateFrom && this.selectedDateUntil) {
      event.preventDefault();
      if (this.selectedDateUntil.getTime() < this.selectedDateFrom.getTime()) {
        Confirms.showErrorType(Messages.titleErrorDateFilter, Messages.messageErrorDateFilter);
        return;
      }
      AppComponent.spinner.show();
      this.serviceQueries.read(Messages.urlAllMovements + '/' + this.selectedContribution.toLowerCase() + '/' + Utilities.getFormatDate(this.selectedDateFrom) + '/' + Utilities.getFormatDate(this.selectedDateUntil)).subscribe(
        res => {
          // @ts-ignore
          this.dataSource.data = res;
          AppComponent.notifies.showSuccess(Messages.titleSuccessFilter, '');
          AppComponent.spinner.hide();
        },
        error => {
          AppComponent.spinner.hide();
          Confirms.showErrorType(Messages.titleErrorFilter, Messages.messageErrorInternetConexion);
        },
      );
        // console.log(this.selectedDateFrom.getTime());
        // console.log(this.selectedDateFrom.getDate());
        // console.log(this.selectedDateFrom.getUTCMonth());
        // console.log(this.selectedDateFrom.getUTCFullYear());
        // console.log(this.selectedDateUntil.getDate());
        // console.log(this.selectedDateUntil);
        // this.selectedDateUntil.setTime(1547614800000);
        // console.log(this.selectedDateUntil.getDate());
        // alert('pasa');
    }
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

  inFileSelected(event, imageAvatar) {
    this.selectedImage = '../../assets/' + event.target.files[0].name;
    imageAvatar.src = this.selectedImage;
    // @ts-ignore
    // document.getElementById('img--').src = this.selectedImage;
  }

  ngAfterViewInit(): void {
    this.updateTable();
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    AppComponent.notifies.clear();
  }
}
