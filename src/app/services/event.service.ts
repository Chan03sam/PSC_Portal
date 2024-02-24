import { Injectable } from '@angular/core';
import { EventComponent } from '../components/event/event.component';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { MyEvent } from '../models/event.model';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsCollection: AngularFirestoreCollection<MyEvent>;

  constructor(
    private firestore: AngularFirestore,) {
    this.eventsCollection = this.firestore.collection<MyEvent>('events');
  }
  getEvents(): Observable<MyEvent[]> {
    return this.eventsCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as MyEvent;
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  async addEvent(event: MyEvent, bannerFile: File): Promise<void> {
    // Create a unique filename for the banner using timestamp
    const bannerFileName = `${new Date().getTime()}_${bannerFile.name}`;

    // Get the Firebase Storage reference
    const storage = getStorage();
    const bannerRef = ref(storage, `event_banners/${bannerFileName}`);

    // Upload the banner file to Firebase Storage
    await uploadBytes(bannerRef, bannerFile);

    // Get the download URL of the uploaded banner
    const bannerURL = await getDownloadURL(bannerRef);

    // Add event data to Firestore with the banner URL
    const docRef = await this.firestore.collection('events').add({
      ...event,
      banner: bannerURL,
      timestamp: new Date()
    });

    // Update the document with the generated ID
    await docRef.update({ id: docRef.id });

    // Return a void promise
    return Promise.resolve();
  }
}
