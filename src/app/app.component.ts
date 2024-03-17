import { Component, NgZone } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PSC';
  message: any;

  constructor(
    private spinner: NgxSpinnerService,
    private notificationService: NotificationService
    ) {}

    ngOnInit() {
      this.spinner.show();
    setTimeout(() => {
      this.hideSpinner();
    }, 5000);
    this.notificationService.requestPermission()
    this.notificationService.receiveMessage()
    this.message = this.notificationService.currentMessage
  }

  hideSpinner() {
    this.spinner.hide();
  }

  
 
}
