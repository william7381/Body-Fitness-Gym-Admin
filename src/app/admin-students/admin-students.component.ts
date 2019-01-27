import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {DialogAddMovementComponent} from '../dialogs/add-movement/dialog-add-movement.component';
import {ViewValue} from '../interfaces';
import {Router} from '@angular/router';
import {RoutersApp} from '../util/RoutersApp';
import {Messages} from '../util/Messages';
import {Utilities} from '../util/Utilities';
import {AppComponent} from '../app.component';
import {ServiceQueries} from '../services/queries/service-queries.service';
import {Confirms} from '../util/Confirms';

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.css']
})
export class AdminStudentsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['position', 'nombre', 'fechaNacimiento', 'dni', 'telefono', 'email', 'genero', 'options'];
  dataSource = new MatTableDataSource();
  //----------------------------------------------------
  typesBloods: ViewValue[] = [
    {value: '0', viewValue: 'A+'},
    {value: '0', viewValue: 'A-'},
    {value: '1', viewValue: 'B+'},            // Debe venir desde la base de datos
    {value: '1', viewValue: 'B-'},            // Debe venir desde la base de datos
    {value: '2', viewValue: 'AB+'},
    {value: '2', viewValue: 'AB-'},
    {value: '2', viewValue: 'O+'},
    {value: '2', viewValue: 'O-'},
  ];
  selectedTypeBlood = this.typesBloods[0].value;
  isLoadingTable = true;
  //-----------------------------------------------

  constructor(public dialog: MatDialog, private router: Router, private serviceQueries: ServiceQueries) {
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
    const m = this.serviceQueries.read(Messages.urlAllStudents);
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

  }

  edit(element) {
  }

  remove(element) {
    Confirms.showChooserOption(Messages.titleChooseRemove, Messages.warning).then((response) => {
      if (response.value) {
        AppComponent.spinner.show();
        this.serviceQueries.delete(Messages.urlClass, element.idAlumno).subscribe(
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

  openDialogAddStudent() {
    this.router.navigateByUrl(RoutersApp.completeAddStudent);
  }
}
