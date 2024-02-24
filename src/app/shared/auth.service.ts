import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { FieldValue, serverTimestamp } from 'firebase/firestore';
import { query, where, Query } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private name: string = '';
  private email: string = '';
  private password: string = '';
  role?: string = '';
  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();
  private emailSubject = new BehaviorSubject<string>(''); 
  email$ = this.emailSubject.asObservable();
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();
  

  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private zone: NgZone ) 
    {
      this.email = '';
      this.password = ''; 
      this.initializeAuthState();
  }
  
  setName(name: string) {
    this.name = name;
  }
  getCurrentUser() {
    return this.fireauth.currentUser;
  }

  getAllUsers1(): Observable<any[]> {
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
  
    return new Observable<any[]>((observer) => {
      getDocs(usersCollection)
        .then((querySnapshot) => {
          const users: any[] = [];
          querySnapshot.forEach((doc) => {
            const userData: any = doc.data();
            if (userData && userData['role'] === 'user') {
              users.push({
                uid: doc.id,
                ...userData,
                registrationTimestamp: userData['registrationTimestamp']?.toDate(),
              });
            }
          });
          observer.next(users);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getAllUsers2(): Observable<any[]> {
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
  
    return new Observable<any[]>((observer) => {
      getDocs(usersCollection)
        .then((querySnapshot) => {
          const users: any[] = [];
          querySnapshot.forEach((doc) => {
            const userData: any = doc.data(); // Cast to any here
  
            // Check if the user has the role 'user' before adding to the array
            if (userData && userData['role'] === 'admin') {
              users.push({
                uid: doc.id,
                ...userData,
                registrationTimestamp: userData['registrationTimestamp']?.toDate(),
              });
            }
          });
          observer.next(users);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
  
  updateUserRole(email: string, role: string): Promise<void> {
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    
    const emailQuery: Query = query(usersCollection, where('email', '==', email));
  
    return getDocs(emailQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);
          
          return setDoc(userRef, { role: role }, { merge: true });
        } else {
          return Promise.reject(`User with email ${email} not found.`);
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  getUserRole(uid: string) {
    const db = getFirestore();
    const userRef = doc(db, 'users', uid);

    getDoc(userRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData: any = docSnap.data();
          if (userData && userData.role) {
            this.role = userData.role;
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }
  
  
  // auth.service.ts
async getUserName(uid: string): Promise<string | undefined> {
  const db = getFirestore();
  const userRef = doc(db, 'users', uid);

  try {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData: any = docSnap.data();
      
      if (userData && userData.name) {
        this.name = userData.name;
        this.userNameSubject.next(this.name);
        return this.name;
      }
    }

    console.error('User name is undefined.');
    return undefined;
  } catch (error) {
    console.error('Error fetching user name:', error);
    return undefined;
  }
}

  
getUserEmail(uid: string): Promise<string | undefined> {
  const db = getFirestore();
  const userRef = doc(db, 'users', uid);

  return getDoc(userRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        const userData: any = docSnap.data();
        if (userData && userData.email) {
          return userData.email;
        }
      }
      return undefined;
    })
    .catch((error) => {
      console.error('Error fetching user email:', error);
      return undefined;
    });
}

  getUserData(uid: string): Observable<any> {
    const db = getFirestore();
    const userRef = doc(db, 'users', uid);
  
    return new Observable<any>((observer) => {
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData: any = docSnap.data();
            if (userData) {
              observer.next({
                ...userData,
                profileImageURL: userData.profileImageURL || '/assets/images/user_icon.png',
              });
              observer.complete();
            } else {
              observer.error('User data not found');
            }
          } else {
            observer.error('User document not found');
          }
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
  
  private updateUserInformation(uid: string) {
    this.isLoggedIn.next(true);
    this.getUserRole(uid);
    this.getUserName(uid);
    this.getUserEmail(uid);
}

async getProfileImageURL(userEmail: string): Promise<string | undefined> {
  const storage = getStorage();
  const profileImageRef = ref(storage, `profile_images/${userEmail}.jpg`);

  try {
    const profileImageURL = await getDownloadURL(profileImageRef);
    return profileImageURL;
  } catch (error) {
    console.error('Error fetching profile image URL:', error);
    return undefined;
  }
}
  
  //login method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(res => {
        if (res.user?.emailVerified === true) {
          this.updateUserInformation(res.user.uid);
          this.router.navigate(['/']);
        } else {
          alert('Verify your email first');
          this.router.navigate(['/verify']);
        }
      })
      .catch(error => {
        // Handle authentication errors here
        console.error('Login failed:', error.message);
        alert('Invalid credentials. Please check your email and password.');
      });
  }
  

  private initializeAuthState() {
    this.fireauth.onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user?.emailVerified) {
          this.isLoggedIn.next(true);
          this.updateUserInformation(user.uid);
        } else {
          this.isLoggedIn.next(false);
        }
      });
    });
    this.fireauth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return this.fireauth.signInWithEmailAndPassword(this.email, this.password);
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });
  }

  //register method
  async register(email: string, password: string) {
    try {
      const userCredential = await this.fireauth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      if (user) {
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        const registrationTimestamp = serverTimestamp();
        await setDoc(userRef, {
          name: this.name,
          email: user.email,
          role: 'user',
          registrationTimestamp: registrationTimestamp
        });
        await this.sendEmailVerification(user);
        alert('Registration is Successful!');
        this.router.navigate(['/']);
      } else {
        alert('User registration failed.');
      }
    } catch (err) {
      alert('Something went wrong');
      this.router.navigate(['register']);
    }
  }

  //logout method
  logout() {
    this.fireauth.signOut().then(() => {
      this.isLoggedIn.next(false);
      this.router.navigate(['/']);
    }).catch((error) => {
      console.error('Error during sign-out:', error);
    });
  }
  

  forgotPassword(email: string){
    this.fireauth.sendPasswordResetEmail(email).then( () => {
      this.router.navigate(['/changepass']);
    }, err => {
      alert("Something went wrong");
    })
  }

  //email verification
  sendEmailVerification(user: any){
    user.sendEmailVerification().then((res : any) =>  { 
      alert('verify your email');
      this.router.navigate(['/verify']);
    }, (err : any) => {
      alert('Something Went Wrong. Not able to send email to your email');
    });
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn.value;
  }

  updateUserProfile(uid: string, profileData: any): Promise<void> {
    const db = getFirestore();
    const userRef = doc(db, 'users', uid);
  
    return setDoc(userRef, profileData, { merge: true });
  }
}

