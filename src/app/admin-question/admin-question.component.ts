import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {ServiceQueries} from '../services/queries/service-queries.service';
import {Messages} from '../util/Messages';
import {AppComponent} from '../app.component';
import {PreviewObject} from '../interfaces';
import {DialogAddProgramComponent} from '../dialogs/add-program/dialog-add-program.component';
import {Confirms} from '../util/Confirms';
import {DialogAddQuestionComponent} from '../dialogs/add-question/dialog-add-question.component';

@Component({
  selector: 'app-admin-question',
  templateUrl: './admin-question.component.html',
  styleUrls: ['./admin-question.component.css']
})
export class AdminQuestionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['posicion', 'nombre', 'descripcion', 'options'];
  dataSource = new MatTableDataSource();
  isLoadingTable = true;

  constructor(public dialog: MatDialog, private serviceQueries: ServiceQueries) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.updateTable();
    this.dataSource.paginator = this.paginator;
  }

  search(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateTable() {
    this.dataSource.data = [];
    this.isLoadingTable = true;
    const s = this.serviceQueries.read(Messages.urlAllQuestions);
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

  private showScreenDark(dialogRef) {
    if (this.isScreenLow()) {
      dialogRef.updateSize('70%', 'max-content');
    }
    this.setEventOpacityScreen(dialogRef);
  }

  preview(element) {
    const dataEdit: PreviewObject = {dataPreview: element, isPreview: true};
    const dialogRef = this.dialog.open(DialogAddQuestionComponent, {
      width: '30%',
      height: 'max-content',
      data: dataEdit,
      maxHeight: '90%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateTable();
      }
    });
    this.showScreenDark(dialogRef);
  }

  addQuestion() {
    const dialogRef = this.dialog.open(DialogAddQuestionComponent, {
      width: '30%',
      height: 'max-content',
      maxHeight: '90%'
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
    const dialogRef = this.dialog.open(DialogAddQuestionComponent, {
      width: '30%',
      height: 'max-content',
      data: dataEdit,
      maxHeight: '90%'
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
        this.serviceQueries.delete(Messages.urlQuestion, element.idPregunta).subscribe(
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

  ngOnDestroy(): void {
    AppComponent.notifies.clear();
  }
}
