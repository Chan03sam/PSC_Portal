import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-employee-accounts',
  templateUrl: './employee-accounts.component.html',
  styleUrls: ['./employee-accounts.component.css']
})
export class EmployeeAccountsComponent implements OnInit{

  users: any[] = [];
  newAdminEmail: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  fetchAllUsers(): void {
    this.authService.getAllUsers2().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  addAdmin(): void {
    if (this.newAdminEmail.trim() !== '') {
      this.authService.updateUserRole(this.newAdminEmail, 'admin')
        .then(() => {
          alert(`Role updated successfully for ${this.newAdminEmail}`);
          this.fetchAllUsers();
        })
        .catch((error) => {
          alert(`Error updating role for ${this.newAdminEmail}:`)
        });
    } else {
      console.warn('Email field is empty.');
    }
  }

  removeAdmin(): void {
    if (this.newAdminEmail.trim() !== '') {
      this.authService.updateUserRole(this.newAdminEmail, 'user')
        .then(() => {
        alert(`Role updated successfully for ${this.newAdminEmail}`);
          this.fetchAllUsers();
        })
        .catch((error) => {
          alert(`Error updating role for ${this.newAdminEmail}:`)
        });
    } else {
      console.warn('Email field is empty.');
    }
  }

}
