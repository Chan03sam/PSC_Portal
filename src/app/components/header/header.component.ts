import { Component } from '@angular/core';
import { ModalService } from 'src/app/shared/modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private modalService: ModalService) {}

  showPostComponent: boolean = false;
  showEventComponent: boolean = false;
  showAnnouncementComponent: boolean = false;

  openLoginModal(): void {
    this.modalService.openLoginModal();
    alert("You need to login first.");
  }

  toggleComponent(componentName: string): void {
    // Close other components when a new one is toggled
    this.showPostComponent = componentName === 'post' ? !this.showPostComponent : false;
    this.showEventComponent = componentName === 'event' ? !this.showEventComponent : false;
    this.showAnnouncementComponent = componentName === 'announcement' ? !this.showAnnouncementComponent : false;
  }
}
