// announcement.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Announcement } from '../models/announcement.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private announcementsCollection: AngularFirestoreCollection<Announcement>;

  constructor(private firestore: AngularFirestore) {
    this.announcementsCollection = this.firestore.collection<Announcement>('announcements');
  }

  getAnnouncements(): Observable<Announcement[]> {
    return this.announcementsCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Announcement;
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  addAnnouncement(announcement: Announcement): Promise<any> {
    return this.announcementsCollection.add(announcement);
  }

  getAnnouncementCount(): Observable<number> {
    return this.firestore.collection('announcements').get().pipe(
      map(snapshot => snapshot.size)
    );
  }
}
