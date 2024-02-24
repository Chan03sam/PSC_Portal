import { Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { ProfileService } from 'src/app/shared/profile.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  firstName: string = '';
  lastName: string = '';
  middleName: string = '';
  age: string = '';
  gender: string = '';
  contactNo: string = '';
  birthDate: string = '';
  placeOfBirth: string = '';
  civilStatus: string = '';
  address: string = '';
  userData: any = {};
  profileImage: string | ArrayBuffer | null = '/assets/images/user_icon.png';
  profileImageURL: string = '';
  
  constructor(
    private authService: AuthService, 
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private profileService: ProfileService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.authService.userName$.subscribe(name => {
      this.userName = name;
    });

    this.authService.email$.subscribe(email => {
      this.userEmail = email;
    });

    this.afAuth.user.subscribe(user => {
      if (user) {
        const uid = user.uid;
  
        this.authService.getUserData(uid).subscribe(data => {
          this.userData = data;
        });
      }
    });

    this.profileService.profileImageURL$.subscribe((url) => {
      if (url) {
        this.profileImageURL = url;
        this.profileImage = url;
      }
    });
  }
  updateProfile() {
    const userProfileData = {
      firstName: this.userData.firstName || '',
    lastName: this.userData.lastName || '',
    middleName: this.userData.middleName || '',
    age: this.userData.age || '',
    gender: this.userData.gender || '',
    contactNo: this.userData.contactNo || '',
    birthdate: this.userData.birthdate || '',
    placeOfBirth: this.userData.placeOfBirth || '',
    civilStatus: this.userData.civilStatus || '',
    address: this.userData.address || ''
    };

    const userBirthdate = new Date(this.userData.birthdate);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 64, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());

    const userAge = parseInt(this.userData.age, 10);
  if (isNaN(userAge) || userAge < 15 || userAge > 64) {
    alert('Invalid age. Please enter an age between 15 and 64.');
    return;
  }

  if (userBirthdate < minDate || userBirthdate > maxDate) {
    alert('Invalid birthdate. Please enter a birthdate between 15 and 64 years ago.');
    return;
  }

    if (this.profileImageURL) {
      this.profileService.setProfileImageURL(this.profileImageURL);
    }
  
    this.afAuth.user.subscribe(user => {
      if (user) {
        const uid = user.uid;
        this.authService.updateUserProfile(uid, userProfileData)
          .then(() => {
            alert('Profile updated successfully');
            this.router.navigate(['/view-profile']);
          })
          .catch((error) => {
            alert('Error updating profile');
          });
      }
    });
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        // Check if the file type is 'image/jpeg' or 'image/jpg'
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          // Use the user's email as the file name
          const filePath = `profile_images/${this.userData.email}.jpg`; // Change this line
          const storageRef = this.storage.ref(filePath);
          const uploadTask = this.storage.upload(filePath, file);
          this.profileImageURL = e.target.result;
          this.profileService.setProfileImageURL(this.profileImageURL);
          // Listen for state changes, errors, and completion of the upload.
          uploadTask.snapshotChanges().subscribe(
            (snapshot) => {
              // Track the upload progress here if needed
            },
            (error) => {
              console.error('Error uploading image:', error);
            },
            () => {
              // Upload completed successfully, get the download URL
              storageRef.getDownloadURL().subscribe((downloadURL) => {
                // Update the profileImage with the download URL
                this.profileImage = downloadURL;
                console.log(this.profileImage = downloadURL);
              });
            }
          );
        } else {
          alert('Invalid file type. Please select a JPEG or JPG file.');
          // Clear the selected file
          (event.target as HTMLInputElement).value = '';
        }
      };
  
      reader.readAsDataURL(file);
    }
  }

  onForgeryFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Check if the file type is 'image/jpeg' or 'image/jpg'
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          // Use the user's email in the file path
          const filePath = `verification_images/${this.userEmail}/${file.name}`;
          const storageRef = this.storage.ref(filePath);
          const uploadTask = this.storage.upload(filePath, file);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.snapshotChanges().subscribe(
            (snapshot) => {
              // Track the upload progress here if needed
            },
            (error) => {
              console.error('Error uploading image:', error);
            },
            () => {
              // Upload completed successfully, get the download URL
              storageRef.getDownloadURL().subscribe((downloadURL) => {
                console.log('Uploaded forgery file URL:', downloadURL);
              });
            }
          );
        } else {
          alert('Invalid file type. Please select a JPEG or JPG file.');
          // Clear the selected file
          (event.target as HTMLInputElement).value = '';
        }
      };

      reader.readAsDataURL(file);
    }
  }

  

  uploadImage(file: File) {
    const filePath = `profile_images/${this.userData.email}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);
    
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL) => {
          this.profileImage = downloadURL;
          this.userData.profileImage = downloadURL;
          this.profileService.setProfileImageURL(downloadURL);
          const fileName = this.getFileNameFromURL(downloadURL);
          console.log('Uploaded file name:', fileName);
        });
      })
    )
    .subscribe();
  }
  getFileNameFromURL(url: string): string {
    // Extract the file name from the URL
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}