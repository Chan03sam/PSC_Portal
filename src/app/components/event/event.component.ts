import { Component } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyEvent } from 'c:/Users/samon/Desktop/PSC_Portal/src/app/models/event.model';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  events: MyEvent[] = [];
  event: MyEvent = {
    text: '',
    banner: '',
    location: '',
    startDate: new Date(),
    endDate: new Date()
  };
  showForm: boolean = true;

  constructor(private eventService: EventService,private authService: AuthService) {
    this.fetchEvents();
  }

  fetchEvents() {
    this.eventService.getEvents().pipe(
      map((data: any) => {
        this.events = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Sort by timestamp in descending order
      })
    ).subscribe(
      () => {}, // Success callback, you can handle success if needed
      error => console.error('Error fetching events:', error) // Error callback
    );
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  saveEvent() {
    if (!this.bannerFile) {
      console.error('No banner file selected.');
      return;
    }
    if (this.authService?.role === 'admin' || 'superadmin') {
    this.event.timestamp = new Date();
    
    this.eventService.addEvent(this.event, this.bannerFile)
      .then(() => {
        this.fetchEvents();
        this.resetEventForm();
      })
      .catch(error => {
        console.error('Error saving event:', error);
      });
    } else {
      alert('Only the Barangay Officials can post here!');
    }
  }

  selectedImage: string | ArrayBuffer | null = null;
  bannerFile: File | null = null;

  onImageChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.selectedImage = e.target?.result ?? null;
      };

      reader.readAsDataURL(file);
      this.bannerFile = file; // Assign the file to bannerFile
    }
  }

  resetEventForm() {
    this.event = {
      text: '',
      banner: '',
      location: '',
      startDate: new Date(),
      endDate: new Date()
    };
    this.bannerFile = null;

    const fileInput = document.getElementById('banner') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  logImageURL(imageURL: string) {
    console.log('Image URL:', imageURL);
}
}
