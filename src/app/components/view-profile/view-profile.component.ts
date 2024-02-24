import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from 'src/app/shared/profile.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit{
  userName: string = '';
  userEmail: string = '';
  profileImageURL: string = '';
  userData: any = {};
  private profileImageURLSource = new BehaviorSubject<string>('');
  profileImageURL$ = this.profileImageURLSource.asObservable();

  setProfileImageURL(url: string) {
    this.profileImageURLSource.next(url);
  }
  
  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private afAuth: AngularFireAuth) {
  }

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
}
