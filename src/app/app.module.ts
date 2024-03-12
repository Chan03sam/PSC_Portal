import { environment } from 'src/environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { BannerComponent } from './components/banner/banner.component';
import { PostComponent } from './components/post/post.component';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { EventComponent } from './components/event/event.component';
import { AboutComponent } from './components/about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import {AngularFireModule} from '@angular/fire/compat';
import { RegisterComponent } from './components/register/register.component'
import { FormsModule } from '@angular/forms';
import { FormsComponent } from './components/forms/forms.component';
import { HistoryComponent } from './components/history/history.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyComponent } from './components/verify/verify.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RequestsComponent } from './components/requests/requests.component';
import { EmployeeAccountsComponent } from './components/employee-accounts/employee-accounts.component';
import { UserAccountsComponent } from './components/user-accounts/user-accounts.component';
import { AuditTrailComponent } from './components/audit-trail/audit-trail.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { collection, getDocs } from 'firebase/firestore';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getAuth } from 'firebase/auth';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { DatePipe } from '@angular/common';
import { ChangepassComponent } from './components/changepass/changepass.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TimestampPipe } from './models/timestamp.pipe';
import { BusinessClearanceComponent } from './components/certs/business-clearance/business-clearance.component';
import { CertIndigencyComponent } from './components/certs/cert-indigency/cert-indigency.component';
import { CertCohabitationComponent } from './components/certs/cert-cohabitation/cert-cohabitation.component';
import { CertResidencyComponent } from './components/certs/cert-residency/cert-residency.component';
import { CertGoodmoralComponent } from './components/certs/cert-goodmoral/cert-goodmoral.component';
import { CertGuardianshipComponent } from './components/certs/cert-guardianship/cert-guardianship.component';
import { BrgyIdComponent } from './components/certs/brgy-id/brgy-id.component';
import { BrgyClearanceComponent } from './components/certs/brgy-clearance/brgy-clearance.component';
import { CommonModule } from '@angular/common';
import { RequestDetailsModalComponent } from './modal/request-details-modal/request-details-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { getMessaging, getToken } from 'firebase/messaging';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';


const firebaseConfig = {
  apiKey: "AIzaSyATZzZihKVOQna8Uv_4cqN1Gimu3KBgl7Q",
  authDomain: "myangu.firebaseapp.com",
  databaseURL: "https://myangu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myangu",
  storageBucket: "myangu.appspot.com",
  messagingSenderId: "15173791329",
  appId: "1:15173791329:web:94ff393db9711bcdd20420",
  measurementId: "G-XWG9CZCHRC"
};

AngularFireModule.initializeApp(firebaseConfig),
AngularFireAuthModule,
{
  persistence: 'local',
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    BannerComponent,
    PostComponent,
    AnnouncementComponent,
    EventComponent,
    AboutComponent,
    LoginModalComponent,
    RegisterComponent,
    FormsComponent,
    HistoryComponent,
    ForgotPasswordComponent,
    VerifyComponent,
    DashboardComponent,
    RequestsComponent,
    EmployeeAccountsComponent,
    UserAccountsComponent,
    AuditTrailComponent,
    ViewProfileComponent,
    ProfileEditComponent,
    ChangepassComponent,
    TimestampPipe,
    LoadingComponent,
    BusinessClearanceComponent,
    CertIndigencyComponent,
    CertCohabitationComponent,
    CertResidencyComponent,
    CertGoodmoralComponent,
    CertGuardianshipComponent,
    BrgyIdComponent,
    BrgyClearanceComponent,
    RequestDetailsModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    AngularFireAuthModule,
    NgxSpinnerModule,
    NoopAnimationsModule,
    HttpClientModule,
    AngularFireMessagingModule,
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule implements OnInit {
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.requestPermission();
    
    // Subscribe to receiveMessage
    this.notificationService.receiveMessage().subscribe((message) => {
      console.log('Received message in AppModule:', message);
      // Handle the message as needed
    });
  }
}
