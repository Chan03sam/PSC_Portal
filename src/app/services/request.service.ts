import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private firestore: AngularFirestore) {}

  addRequest(request: any) {
    return this.firestore.collection('requests').add(request);
  }

  getRequests(): Observable<any[]> {
    return this.firestore.collection('requests', ref => ref.orderBy('timestamp', 'desc')).valueChanges({ idField: 'id' });
  }

  updateRequestStatus(requestId: string, status: string): Promise<void> {
    return this.firestore.collection('requests').doc(requestId).update({ status });
  }

}
