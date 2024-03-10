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

    onMessage(messaging, (payload) => {
      console.log('New message received:', payload);
      this.currentMessage.next(payload);
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
