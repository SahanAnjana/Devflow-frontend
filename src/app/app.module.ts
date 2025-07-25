import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './Layout/Pages/dashboard/dashboard.component';
import { LoginComponent } from './Layout/Pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { ForgetComponent } from './Layout/Pages/forgot-password/forgot-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserManagementModule } from './Layout/Components/user-management/user-management.module';
import { ResetpasswordComponent } from './Layout/Pages/resetpassword/resetpassword.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SignupComponent } from './Layout/Components/signup/signup/signup.component';
import { LoadingComponent } from './Layout/Components/common/loading/loading.component';
import { JwtInterceptor } from './_helpers/jwtinterceptor';
import { DecimalFormatDirective } from './directives/decimal-format.directive';
import { TFACodeComponent } from './Layout/Pages/tfa-code/tfa-code.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { DevFlowComponent } from './Layout/Pages/dev-flow/dev-flow/dev-flow.component';
import { SidebarComponent } from './Layout/Pages/dev-flow/sidebar/sidebar.component';
import { TopNavigationComponent } from './Layout/Pages/dev-flow/top-navigation/top-navigation.component';
import { DevDashboardModule } from './Layout/Components/dev-dashboard/dev-dashboard.module';
import { ProjectsModule } from './Layout/Components/PM/projects.module';
import { HrModule } from './Layout/Components/HR/hr.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ForgetComponent,
    LoginComponent,
    ResetpasswordComponent,
    SignupComponent,
    LoadingComponent,
    DecimalFormatDirective,
    TFACodeComponent,
    DevFlowComponent,
    SidebarComponent,
    TopNavigationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    UserManagementModule,
    AngularEditorModule,
    NgOtpInputModule,
    DevDashboardModule,
    ProjectsModule,
    HrModule,
  ],
  exports: [DecimalFormatDirective],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
