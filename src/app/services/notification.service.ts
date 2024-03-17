import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  currentMessage = new BehaviorSubject<MessagePayload | null>(null);

  constructor() {
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

}
