import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatTableDataSource} from '@angular/material';
import {AdminAddClassComponent} from '../../admin-add-class/admin-add-class.component';
import {Messages} from '../../util/Messages';
import {AppComponent} from '../../app.component';
import {ServiceQueries} from '../../services/queries/service-queries.service';
import {PreviewObject} from '../../interfaces';
import {Confirms} from '../../util/Confirms';
import {SelectionModel} from '@angular/cdk/collections';
import {DialogAddStudentComponent} from '../add-student/dialog-add-student.component';

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
  studentsChosenId = [];
  selection = new SelectionModel(true, []);
  isPreview = false;
  schedule = null;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AdminAddClassComponent>, private serviceQueries: ServiceQueries, @Inject(MAT_DIALOG_DATA) private dataEdit: PreviewObject) {
    if (this.dataEdit && this.dataEdit.dataPreview) {
      this.schedule = this.dataEdit.dataPreview;
      this.studentsChosen = this.schedule.asistencia;
      if (this.dataEdit.isPreview) {
        this.isPreview = true;
        this.students.data = this.studentsChosen;
        this.isLoadingTableStudents = false;
      }
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (!this.isPreview) {
      this.updateTableStudents();
    }
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
        this.students.data.forEach(row => {
          for (const student of this.studentsChosen) {
            // @ts-ignore
            if (student.dniAlumno === row.dniAlumno) {
              this.selection.selected.push(row);
              this.selection.select(row);
              this.studentsChosenId.push({dniAlumno: student.dniAlumno});
            }
          }
        });
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
    const dataEdit: PreviewObject = {dataPreview: student, isPreview: true};
    this.dialog.open(DialogAddStudentComponent, {
      width: '30%',
      height: '90%',
      data: dataEdit
    });
  }

  chooseStudent(event, student) {
    event.stopPropagation();
    const indexOf = this.studentsChosen.indexOf(student);
    if (indexOf >= 0) {
      this.studentsChosen.slice(indexOf, 1);
      this.studentsChosenId.slice(indexOf, 1);
    } else {
      this.studentsChosen.push(student);
      this.studentsChosenId.push({dniAlumno: student.dniAlumno});
    }
    // AppComponent.notifies.showSuccess(Messages.titleSuccessAddStudent,  'Nombre : ' + student.nombreAlumno + ', dni : ' + student.dniAlumno);
    // if (this.studentsChosen.indexOf(item => item.idAlumno === student.idAlumno)) {
    //   Confirms.showErrorType(Messages.titleErrorStudentAlreadyExist, Messages.messageErrorSelectedOther);
    //   return;
    // }
  }

  addStudentsToSchedule() {
    AppComponent.spinner.show();
    // this.dataEdit.asistencia = this.studentsChosen;
    // console.log(JSON.stringify(this.dataEdit));
    console.log(JSON.stringify(this.studentsChosenId));
    this.serviceQueries.update(Messages.urlSchedule + Messages.urlSubscriptionStudent + '/' + this.schedule.idHorario, this.studentsChosenId).subscribe(
      res => {
        AppComponent.spinner.hide();
        AppComponent.notifies.showSuccess(Messages.titleSuccessEdit, '');
        this.dialogRef.close(res);
      },
      error => {
        console.log(error);
        AppComponent.spinner.hide();
        Confirms.showErrorType(Messages.titleErrorEdit, Messages.messageErrorInternetConexion);
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
