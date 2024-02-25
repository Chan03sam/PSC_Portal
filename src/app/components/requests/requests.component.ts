import { Component } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from 'src/app/models/post.model';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from 'src/app/shared/profile.service';
import { RequestDetailsModalComponent } from 'src/app/modal/request-details-modal/request-details-modal.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent {
  showContent?: boolean;
  pendingRequests: any[] = [];
  approvedRequests: any[] = [];
  rejectedRequests: any[] = [];
  activeTab: string = 'pending'; 
  userProfileImage: string = '';
  searchInput: string = ''; 

  constructor(
    private requestService: RequestService,
    private dialog: MatDialog) {
    this.fetchRequests();
  }

  fetchRequests() {
    this.requestService.getRequests().pipe(
      map((data: any) => {
        const requestsArray = Object.keys(data).map(key => ({ ...data[key], showContent: false }));
        const sortedRequests = requestsArray.sort((a, b) => b.timestamp - a.timestamp);
  
        this.pendingRequests = sortedRequests.filter(request => request.status === 'pending');
        this.approvedRequests = sortedRequests.filter(request => request.status === 'approve');
        this.rejectedRequests = sortedRequests.filter(request => request.status === 'reject');
      })
    ).subscribe();
  }
  

  onSearchInput() {
    // Update the displayed requests based on the search term
    this.pendingRequests = this.filterRequests(this.pendingRequests);
    this.approvedRequests = this.filterRequests(this.approvedRequests);
    this.rejectedRequests = this.filterRequests(this.rejectedRequests);
  }
  
  filterRequests(requests: any[]): any[] {
    if (!this.searchInput.trim()) {
      this.fetchRequests();
      return requests;
    }
  
    const searchTerm = this.searchInput.toLowerCase().trim();
    return requests.filter(request =>
      request.name.toLowerCase().includes(searchTerm) ||
      request.formType.toLowerCase().includes(searchTerm)
    );
  }
  
  toggleContent(request: any): void {
    const dialogRef = this.dialog.open(RequestDetailsModalComponent, {
      data: { request },
    });
}

  approveRequest(requestId: string) {
    this.requestService.updateRequestStatus(requestId, 'approve')
      .then(() => {
        this.fetchRequests(); // Refresh the requests after approval
      })
      .catch(error => {
        console.error('Error approving request:', error);
      });
  }
  
  rejectRequest(requestId: string) {
    this.requestService.updateRequestStatus(requestId, 'reject')
      .then(() => {
        this.fetchRequests(); // Refresh the requests after rejection
      })
      .catch(error => {
        console.error('Error rejecting request:', error);
      });
  }
  pendRequest(requestId: string) {
    this.requestService.updateRequestStatus(requestId, 'pending')
      .then(() => {
        this.fetchRequests(); // Refresh the requests after rejection
      })
      .catch(error => {
        console.error('Error rejecting request:', error);
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  getRequestsByStatus(): any[] {
    switch (this.activeTab) {
      case 'pending':
        return this.pendingRequests;
      case 'approve':
        return this.approvedRequests;
      case 'reject':
        return this.rejectedRequests;
      default:
        return [];
    }
  }
  getStatusColor(status: string): string {
    switch (status) {
        case 'pending':
            return 'cornflowerblue';
        case 'approve':
            return 'rgb(39, 104, 39)';
        case 'reject':
            return 'rgb(173, 48, 39)';
        default:
            return 'black';
    }
}
  
}
  