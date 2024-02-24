import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsComponent } from './components/forms/forms.component';
import { HistoryComponent } from './components/history/history.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyComponent } from './components/verify/verify.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeAccountsComponent } from './components/employee-accounts/employee-accounts.component';
import { UserAccountsComponent } from './components/user-accounts/user-accounts.component';
import { AuditTrailComponent } from './components/audit-trail/audit-trail.component';
import { RequestsComponent } from './components/requests/requests.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { ChangepassComponent } from './components/changepass/changepass.component';
import { BrgyIdComponent } from './components/certs/brgy-id/brgy-id.component';
import { BrgyClearanceComponent } from './components/certs/brgy-clearance/brgy-clearance.component';
import { BusinessClearanceComponent } from './components/certs/business-clearance/business-clearance.component';
import { CertCohabitationComponent } from './components/certs/cert-cohabitation/cert-cohabitation.component';
import { CertGoodmoralComponent } from './components/certs/cert-goodmoral/cert-goodmoral.component';
import { CertGuardianshipComponent } from './components/certs/cert-guardianship/cert-guardianship.component';
import { CertIndigencyComponent } from './components/certs/cert-indigency/cert-indigency.component';
import { CertResidencyComponent } from './components/certs/cert-residency/cert-residency.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path: '', component: AppComponent},
  {path: 'about', component: AboutComponent},
  {path: 'login-modal', component: LoginModalComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'header', component: HeaderComponent},
  {path: 'forms', component: FormsComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'verify', component: VerifyComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'employee-accounts', component: EmployeeAccountsComponent},
  {path: 'user-accounts', component: UserAccountsComponent},
  {path: 'audit-trail', component: AuditTrailComponent},
  {path: 'requests', component: RequestsComponent},
  {path: 'view-profile', component: ViewProfileComponent},
  {path: 'view-profile/profile-edit', component: ProfileEditComponent},
  {path: 'changepass', component: ChangepassComponent},
  {path: 'brgy-id', component: BrgyIdComponent},
  {path: 'brgy-clearance', component: BrgyClearanceComponent},
  {path: 'business-clearance', component: BusinessClearanceComponent},
  {path: 'cert-cohabitation', component: CertCohabitationComponent},
  {path: 'cert-goodmoral', component: CertGoodmoralComponent},
  {path: 'cert-guardianship', component: CertGuardianshipComponent},
  {path: 'cert-indigency', component: CertIndigencyComponent},
  {path: 'cert-residency', component: CertResidencyComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
