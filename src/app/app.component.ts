import { Component, NgZone } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PSC';

  constructor(
    private spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
      this.spinner.show();
    setTimeout(() => {
      this.hideSpinner();
    }, 5000);
  }

  hideSpinner() {
    this.spinner.hide();
  }
}
