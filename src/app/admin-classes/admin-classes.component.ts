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

  constructor(private router: Router, private serviceQueries: ServiceQueries, private serviceSubscription: ServiceDataTemp) {
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

  openComponentAddClass() {
    this.serviceSubscription.selectedClass = null;
    this.serviceSubscription.previewClass = false;
    this.router.navigateByUrl(RoutersApp.completeAddClass);
  }

  preview(element) {
    this.serviceSubscription.selectedClass = element;
    this.serviceSubscription.previewClass = true;
    this.router.navigateByUrl(RoutersApp.completeAddClass);
  }

  edit(element) {
    this.serviceSubscription.selectedClass = element;
    this.serviceSubscription.previewClass = false;
    this.router.navigateByUrl(RoutersApp.completeAddClass);
  }

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

  ngOnDestroy(): void {
    AppComponent.notifies.clear();
  }
}
