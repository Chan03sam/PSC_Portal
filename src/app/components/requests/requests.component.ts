import { Component } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from 'src/app/models/post.model';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from 'src/app/shared/profile.service';
import { RequestDetailsModalComponent } from 'src/app/modal/request-details-modal/request-details-modal.component';
import { PDFDocument, rgb} from 'pdf-lib';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as FileSaver from 'file-saver';
import { switchMap, take } from 'rxjs/operators';

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
    private dialog: MatDialog,
    private firestore: AngularFirestore) {
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

async approveRequest(requestId: string) {
  this.requestService.updateRequestStatus(requestId, 'approve')
    .then(() => {
      this.getRequestById(requestId)
        .pipe(
          take(1), // Take only one emission
          switchMap(async (request: any) => {
            if (request && request.formType == 'Barangay Clearance') {
              const generatedPdf = await this.requestService.generateBrgyClearancePdf(request);
              this.savePdf(generatedPdf, 'approved_barangay_clearance_request.pdf');
              console.log('PDF generated and savePdf function called');
              this.fetchRequests(); // Refresh the requests after approval
            }
            if (request && request.formType == 'Business Clearance') {
              const generatedPdf = await this.requestService.generateBusinessClearancePdf(request);
              this.savePdf(generatedPdf, 'approved_business_clearance_request.pdf');
              console.log('PDF generated and savePdf function called');
              this.fetchRequests(); // Refresh the requests after approval
            }
            if (request && request.formType == 'Certificate of Indigency') {
              const generatedPdf = await this.requestService.generateIndigencyPdf(request);
              this.savePdf(generatedPdf, 'approved_indegency_request.pdf');
              console.log('PDF generated and savePdf function called');
              this.fetchRequests(); // Refresh the requests after approval
            }
            if (request && request.formType == 'Certificate of Cohabitation') {
              const generatedPdf = await this.requestService.generateCohabitationPdf(request);
              this.savePdf(generatedPdf, 'approved_cohabitation_request.pdf');
              console.log('PDF generated and savePdf function called');
              this.fetchRequests(); // Refresh the requests after approval
            }
            if (request && request.formType == 'Certificate of Residency') {
              const generatedPdf = await this.requestService.generateResidencyPdf(request);
              this.savePdf(generatedPdf, 'approved_residency_request.pdf');
              console.log('PDF generated and savePdf function called');
              this.fetchRequests(); // Refresh the requests after approval
            }
            if (request && request.formType == 'Certificate of Good-Moral') {
              const generatedPdf = await this.requestService.generateGoodmoralPdf(request);
              this.savePdf(generatedPdf, 'approved_goodmoral_request.pdf');
              console.log('PDF generated and savePdf function called');
              this.fetchRequests(); // Refresh the requests after approval
            }
            if (request && request.formType == 'Certificate of Guardianship') {
              const generatedPdf = await this.requestService.generateGuardianshipPdf(request);
              this.savePdf(generatedPdf, 'approved_guardianship_request.pdf');
              console.log('PDF generated and savePdf function called');
              this.fetchRequests(); // Refresh the requests after approval
            } else {
              console.error('Invalid request object:', request);
            }
          })
        )
        .subscribe();
    })
    .catch(error => {
      console.error('Error approving request:', error);
    });
}
  getRequestById(requestId: string): Observable<any> {
    return this.firestore.collection('requests').doc(requestId).valueChanges({ idField: 'id' });
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
  savePdf(pdfBytes: Uint8Array, fileName: string): void {
    try {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      FileSaver.saveAs(blob, fileName);
      console.log('PDF file saved successfully!');
    } catch (error) {
      console.error('Error saving PDF file:', error);
    }
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
  