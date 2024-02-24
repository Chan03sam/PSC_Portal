import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { AuthService } from '../shared/auth.service';
import { ModalService } from 'src/app/shared/modal.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postsCollection: AngularFirestoreCollection<Post>;

  constructor(private firestore: AngularFirestore, private authService: AuthService,private modalService: ModalService,) {
    this.postsCollection = firestore.collection<Post>('posts');
  }

  
  getPosts(): Observable<Post[]> {
    return this.firestore
      .collection('posts', (ref) => ref.orderBy('timestamp', 'desc'))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Post;
            const id = a.payload.doc.id;
            return { postID: id, ...data };
          });
        })
      );
  }

  async addPost(postContent: string): Promise<void> {
    const user = await this.authService.getCurrentUser();
  
    if (!user) {
      alert('You need to log in to post.');
      this.modalService.openLoginModal();
      return;
    }
  
    // User is logged in, proceed with adding the post
    this.authService.getUserData(user.uid).subscribe(async (userData) => {
      if (userData) {
        const { name, email } = userData;
  
        // Create a new Post object using the model
        const newPost: Post = {
          postContent,
          userEmail: email,
          userProfileImageURL: await this.authService.getProfileImageURL(email),
          userName: name,
          timestamp: new Date(),
        };
  
        // Add the post to Firestore
        await this.firestore.collection<Post>('posts').add(newPost);
      }
    });
  }

  async deletePost(postID: string): Promise<void> {
    try {
      await this.firestore.collection('posts').doc(postID).delete();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error; // Re-throw the error to be caught in the component
    }
  }
}
