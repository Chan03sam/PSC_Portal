import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  currentMessage = new BehaviorSubject<MessagePayload | null>(null);

  constructor(
    private http: HttpClient
  ) {
    const messaging = getMessaging();

    // Register the service worker
    navigator.serviceWorker.register('firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service worker registered successfully:', registration);
        
        // Set up message handler
        onMessage(messaging, (payload) => {
          console.log('New message received:', payload);
          this.currentMessage.next(payload);
        });
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  }

  requestPermission() {
    const messaging = getMessaging();

    getToken(messaging)
      .then((token) => {
        console.log('Permission granted! Save to the server!', token);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  receiveMessage() {
    return this.currentMessage.asObservable();
  }
  sendNotification(token: string, payload: any): Observable<any> {
    const url = 'https://fcm.googleapis.com/fcm/send'; // Replace with your actual notification server endpoint
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer BAAAAA4htrmE:APA91bFjP0wNgYc1LkSkLbLITJWhOgKaPxhGjG0O1sXJjruhHX2boZYio9z6pe2GAQdSt3znQS1E9lZiBRlaqcouMrDoRJeT3MQpNsRbomUvWl4wzO4EE9RLmpxEZLGqxW3P3cPDGhu_' // Replace with your actual authorization token if needed
    };

    return this.http.post(url, { ...payload, to: token }, { headers });
  }

}
