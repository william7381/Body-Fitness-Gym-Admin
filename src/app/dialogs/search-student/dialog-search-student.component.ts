import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatTableDataSource} from '@angular/material';
import {AdminAddClassComponent} from '../../admin-add-class/admin-add-class.component';
import {Messages} from '../../util/Messages';
import {AppComponent} from '../../app.component';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {PreviewObject} from '../../interfaces';
import {Confirms} from '../../util/Confirms';

@Component({
  selector: 'app-search-student',
  templateUrl: './dialog-search-student.component.html',
  styleUrls: ['./dialog-search-student.component.css']
})
export class DialogSearchStudentComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['position', 'name', 'identificationNumber', 'options'];
  students = new MatTableDataSource();
  isLoadingTableStudents = true;
  studentsChosen = [];

  constructor(public dialogRef: MatDialogRef<AdminAddClassComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit) {
    if (this.dataEdit && this.dataEdit) {
      this.studentsChosen = this.dataEdit;
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.updateTableStudents();
    this.students.paginator = this.paginator;
  }

  updateTableStudents() {
    this.students.data = [];
    this.isLoadingTableStudents = true;
    const s = this.serviceQueries.read(Messages.urlAllStudents);
    s.subscribe(res => {
        // @ts-ignore
        this.students.data = res;
        this.isLoadingTableStudents = false;
        if (this.students.data.length === 0) {
          AppComponent.notifies.showWarning(Messages.titleWarningWithoutStudents, Messages.bodyWarningRegisterStudents);
        }
      },
      error => {
        AppComponent.notifies.showError(Messages.titleErrorConnection, Messages.titleErrorGetDataSource);
        this.isLoadingTableStudents = false;
      });
  }

  search(filterValue: string) {
    if (filterValue) {
      this.students.filter = filterValue.trim().toLowerCase();
    }
  }

  preview(student) {
  }

  chooseStudent(event, student) {
    // Hay que revisar si el estudiante ya esta adicionado
    if (this.studentsChosen.find(item => item.idAlumno = student.idAlumno)) {
      Confirms.showErrorType(Messages.titleErrorStudentAlreadyExist, Messages.messageErrorSelectedOther);
      return;
    }
    this.studentsChosen.push(student);
    AppComponent.notifies.showSuccess(Messages.titleSuccessAddStudent,  'Nombre : ' + student.nombreAlumno + ', dni : ' + student.dniAlumno);
  }

  closeDialogAddStudent() {
    this.dialogRef.close(this.studentsChosen);
  }
}
