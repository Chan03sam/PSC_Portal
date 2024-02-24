import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { ProfileService } from 'src/app/shared/profile.service';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-brgy-id',
  templateUrl: './brgy-id.component.html',
  styleUrls: ['./brgy-id.component.css']
})
export class BrgyIdComponent {

  name: string = '';
  address: string = '';
  signature: string = '';
  birthdate: string = '';
  sss: string = '';
  tin: string = '';
  bloodtype: string = '';
  height: string = '';
  weight: string = '';
  emername: string = '';
  emeraddress: string = '';
  emerrelationship: string = '';
  emercontact: string = '';
  formType: string = '';
  userName: string = '';
  profileImageURL: string = '';
  userData: any = {};
  private profileImageURLSource = new BehaviorSubject<string>('');
  profileImageURL$ = this.profileImageURLSource.asObservable();

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private requestService: RequestService,
    private profileService: ProfileService,
    private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    // Subscribe to the userName$ observable to get the user's name
    this.authService.userName$.subscribe(name => {
      this.userName = name;
    });

    this.profileService.profileImageURL$.subscribe((url) => {
      this.profileImageURL = url;
    });

    this.afAuth.user.subscribe(user => {
      if (user) {
        const uid = user.uid;
  
        this.authService.getUserData(uid).subscribe(data => {
          this.userData = data;
        });
      }
    });
  }

  closeFormModal(): void {
    this.dialog.closeAll();
  }

  submitRequest() {
    const user = this.authService.getCurrentUser();

    this.authService.getCurrentUser()
      .then((user) => {
        if (!user || !user.email) {
          console.error('User email is not available.'); // Handle this case appropriately
          return;
        }
        if (!user || !user.uid) {
          console.error('User uid is not available.'); // Handle this case appropriately
          return;
        }
        const timestamp = new Date().toLocaleString();

        const request = {
          name: this.name,
          address: this.address,
          signature: this.signature,
          birthdate: this.birthdate,
          sss: this.sss,
          tin: this.tin,
          bloodtype: this.bloodtype,
          height: this.height,
          weight: this.weight,
          emername: this.emername,
          emeraddress: this.emeraddress,
          emerrelationship: this.emerrelationship,
          emercontact: this.emercontact,
          status: 'pending',
          formType: 'Barangay ID',
          userEmail: user.email,
          userID: user.uid,
          timestamp: timestamp
        };

        this.requestService.addRequest(request)
          .then(() => {
            alert('Your request has been sent and is subject to validation');
            this.closeFormModal();
          })
          .catch(error => {
            console.error('Error submitting request:', error);
          });
      })
      .catch(error => {
        console.error('Error getting user ID:', error);
      });
  }

}
