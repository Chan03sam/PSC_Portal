
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileImageURLSource = new BehaviorSubject<string>('');
  profileImageURL$ = this.profileImageURLSource.asObservable();

  constructor(private afAuth: AngularFireAuth, private authService: AuthService) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.fetchProfileImageURL(user.email || '');
      }
    });
    
  }

  private async fetchProfileImageURL(userEmail: string) {
    try {
      const storage = getStorage();
      const profileImageRef = ref(storage, `profile_images/${userEmail}.jpg`);
      const profileImageURL = await getDownloadURL(profileImageRef);
      this.setProfileImageURL(profileImageURL);
    } catch (error) {
      console.error('Error fetching profile image URL:', error);
    }
  }

  setProfileImageURL(url: string) {
    this.profileImageURLSource.next(url);
  }
  
  getFileNameFromURL(url: string): string {
    // Extract the file name from the URL
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}
