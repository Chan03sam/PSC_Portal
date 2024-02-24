import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmpassword: string = '';

  constructor(private auth: AuthService) { }

  register() {
    if (this.name == '') {
      alert('Please enter name');
      return;
    }
    if (this.email == '') {
      alert('Please enter email');
      return;
    }
    if (this.password == '') {
      alert('Please enter password');
      return;
    }
    if (this.confirmpassword != this.password) {
      alert('Password does not match');
      return;
    }
    
    this.auth.setName(this.name);
    // Registration logic is now in AuthService, including the name
    this.auth.register(this.email, this.password);

    this.name = '';
    this.email = '';
    this.password = '';
    this.confirmpassword = '';
  }
}
