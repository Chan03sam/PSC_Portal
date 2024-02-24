import { Component } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { ModalService } from 'src/app/shared/modal.service';
import { BrgyIdComponent } from '../certs/brgy-id/brgy-id.component';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent {
  constructor(private modalService: ModalService, private requestService: RequestService) {}

  openFormModal(formLink: string, formTitle: string): void {
    this.modalService.openFormModal(formLink, formTitle);
  }
  name: string = '';
  address: string = '';
  purpose: string = '';

  submitRequest() {
    // create a request object
    const request = {
      name: this.name,
      address: this.address,
      purpose: this.purpose,
      status: 'pending', // initial status
    };

    // send the request to Firebase
    this.requestService.addRequest(request).then(() => {
      // show notification to the user
      alert('Your request has been sent and is subject for validation');
    });
  }
}
