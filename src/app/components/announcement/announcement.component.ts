import { Component } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Announcement } from 'src/app/models/announcement.model';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent {
  announcements: Announcement[] = [];
  announcement: Announcement = { text: ''}; 
  showForm: boolean = true;

  constructor(private announcementService: AnnouncementService) {
    this.fetchAnnouncements();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }


  fetchAnnouncements() {
    this.announcementService.getAnnouncements().pipe(
      map((data: any) => {
        // Transform the data from Firebase into an array of announcements
        this.announcements = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp in descending order
      })
    ).subscribe();
  }

  saveAnnouncement() {
    // Save the current announcement with the current timestamp
    this.announcement.timestamp = new Date();
    
    this.announcementService.addAnnouncement(this.announcement)
      .then(() => {
        // Refresh the list of announcements after saving
        this.fetchAnnouncements();
        // Clear the input field after submitting
        this.announcement.text = '';
      })
      .catch(error => {
        console.error('Error saving announcement:', error);
      });
  }
}
