import { Component } from '@angular/core';
import { ModalService } from 'src/app/shared/modal.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private modalService: ModalService,) {
      
    }
    openLoginModal(): void {
      this.modalService.openLoginModal();
      alert("You need to login first.");
    }
}
