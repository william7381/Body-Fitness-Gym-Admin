import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModules} from './materialModules';
import {HttpClientModule} from '@angular/common/http';
import {Route, RouterModule} from '@angular/router';
import {RoutersApp} from './util/RoutersApp';
import {ServiceLogin} from './services/login/service-login.service';

// components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminRootComponent } from './admin-root/admin-root.component';
import { AdminStudentsComponent } from './admin-students/admin-students.component';
import { AdminProgramsComponent } from './admin-programs/admin-programs.component';
import { AdminTrainersComponent } from './admin-trainers/admin-trainers.component';
import { AdminAccountingComponent } from './admin-accounting/admin-accounting.component';

// guards
import {CanActiveVerifyLoginGuard} from './guards/verify-login/can-active-verify-login.guard';
import { DialogAddMovementComponent } from './dialogs/add-movement/dialog-add-movement.component';
import { AdminClassesComponent } from './admin-classes/admin-classes.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdminAddClassComponent } from './admin-add-class/admin-add-class.component';
import { DialogAddProgramComponent } from './dialogs/add-program/dialog-add-program.component';
import { DialogAddScheduleComponent } from './dialogs/add-schedule/dialog-add-schedule.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DialogSearchStudentComponent } from './dialogs/search-student/dialog-search-student.component';
import {DialogAddTrainerComponent} from './dialogs/add-trainer/dialog-add-trainer.component';
import {AdminAddSubscriptionComponent} from './admin-add-subscription/admin-add-subscription.component';
import {DialogAddSubscriptionComponent} from './dialogs/add-suscription/dialog-add-subscription.component';
import {ServiceQueries} from './services/queries/service-queries.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import { DialogAddStudentComponent } from './dialogs/add-student/dialog-add-student.component';
import { AdminQuestionComponent } from './admin-question/admin-question.component';
import { DialogAddQuestionComponent } from './dialogs/add-question/dialog-add-question.component';
import { AdminNewsComponent } from './admin-news/admin-news.component';
import { DialogAddNewsComponent } from './dialogs/add-news/dialog-add-news.component';
import {ServiceDataTemp} from './services/temp/service-temp.service';

const routes: Route[] = [
  {path: RoutersApp.login, component: LoginComponent},
  {path: RoutersApp.admin, component: AdminRootComponent, // canActivate: [CanActiveVerifyLoginGuard],
    children: [
        {path: RoutersApp.accounting, component: AdminAccountingComponent},
        {path: RoutersApp.programs, component: AdminProgramsComponent},
        {path: RoutersApp.classes, component: AdminClassesComponent},
        {path: RoutersApp.addClass, component: AdminAddClassComponent},
        {path: RoutersApp.students, component: AdminStudentsComponent},
        {path: RoutersApp.addStudent, component: AdminAddSubscriptionComponent},
        {path: RoutersApp.trainers, component: AdminTrainersComponent},
        {path: RoutersApp.news, component: AdminNewsComponent},
        {path: RoutersApp.questions, component: AdminQuestionComponent},
    ]
  },
  // {path: RoutersApp.admin, component: AdminRootComponent, canActivate: [CanActiveVerifyLoginGuard],
    // children: [
    //   {path: 'schedules', component: StudentScheduleComponent}
    // ]
  // },
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminRootComponent,
    AdminStudentsComponent,
    AdminProgramsComponent,
    AdminTrainersComponent,
    AdminAccountingComponent,
    DialogAddMovementComponent,
    AdminClassesComponent,
    AdminAddClassComponent,
    DialogAddProgramComponent,
    DialogAddScheduleComponent,
    DialogSearchStudentComponent,
    DialogAddTrainerComponent,
    AdminAddSubscriptionComponent,
    DialogAddSubscriptionComponent,
    DialogAddStudentComponent,
    AdminQuestionComponent,
    DialogAddQuestionComponent,
    AdminNewsComponent,
    DialogAddNewsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModules,
    HttpClientModule,
    RouterModule.forRoot(routes, {useHash: true}),
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule.forRoot(),
    NgxSpinnerModule,
    SnotifyModule
  ],
  entryComponents: [
    DialogAddMovementComponent,
    DialogAddProgramComponent,
    DialogAddScheduleComponent,
    DialogSearchStudentComponent,
    DialogAddTrainerComponent,
    AdminAddSubscriptionComponent,
    DialogAddSubscriptionComponent,
    DialogAddStudentComponent,
    DialogAddQuestionComponent,
    DialogAddNewsComponent,
  ],
  providers: [
    ServiceLogin,
    ServiceQueries,
    ServiceDataTemp,
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
