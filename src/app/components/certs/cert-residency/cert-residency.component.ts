import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { ProfileService } from 'src/app/shared/profile.service';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-cert-residency',
  templateUrl: './cert-residency.component.html',
  styleUrls: ['./cert-residency.component.css']
})
export class CertResidencyComponent {
  name: string = '';
  address: string = '';
  yearsofresidency: string = '';
  purpose: string = '';
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
          purpose: this.purpose,
          yearsofresidency: this.yearsofresidency,
          status: 'pending',
          formType: 'Certificate of Residency',
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
