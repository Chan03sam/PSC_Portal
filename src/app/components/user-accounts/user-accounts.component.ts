import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.css']
})
export class UserAccountsComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  searchInput: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  fetchAllUsers(): void {
    this.authService.getAllUsers1().subscribe(
      (users) => {
        this.users = users;
        this.filteredUsers = [...this.users];
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  onSearchInput(): void {
    // Update the displayed users based on the search term
    if (!this.searchInput.trim()) {
      // If the search input is empty, show all users
      this.filteredUsers = [...this.users];
      return;
    }

    // Filter users based on the search term
    const searchTerm = this.searchInput.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.uid.toLowerCase().includes(searchTerm)
    );
  }
}
