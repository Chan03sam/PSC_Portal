import { Component } from '@angular/core';
import { ModalService } from 'src/app/shared/modal.service';
import { AuthService } from 'src/app/shared/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {

  email: string = '';
  password: string = '';

  constructor(private modalService: ModalService, private auth: AuthService, private afAuth: AngularFireAuth) {

  }

  login(){
    
    if(this.email == ''){
      alert('Please enter email')
      return;
    }
    if(this.password == ''){
      alert('Please enter password')
      return;
    }
    this.auth.login(this.email,this.password);
    this.email = '';
    this.password = '';
    this.modalService.closeLoginModal();
  }

  closeLoginModal(): void {
    this.modalService.closeLoginModal();
  }
}
