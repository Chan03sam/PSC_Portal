// post.component.ts
import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from 'src/app/shared/profile.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Auth } from 'firebase/auth';
import { ChangeDetectorRef, } from '@angular/core';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  posts: any[] = [];
  postContent: string = '';
  profileImageURL: string = '';

  constructor(
    private postService: PostService,
    private profileService: ProfileService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private cdr: ChangeDetectorRef
    ) {}

  

  ngOnInit(): void {
    this.postService.getPosts().subscribe((posts: any[]) => {
      this.posts = posts;

      // Fetch user profile image URL for each post
      this.posts.forEach(async (post) => {
        if (post && post.userEmail) {
          const userProfileImageURL = await this.authService.getProfileImageURL(post.userEmail);
          post.userProfileImageURL = userProfileImageURL;
        }
      });

      // Manually trigger change detection
      this.cdr.detectChanges();
    });

    this.profileService.profileImageURL$.subscribe((url) => {
      this.profileImageURL = url;
    });
  }

  

  addPost(): void {
    if (this.postContent.trim() !== '') {
      this.postService.addPost(this.postContent).then(() => {
        this.postContent = ''; // Clear the input field after posting.
        
        // Manually trigger change detection
        this.detectChanges();
      });
    }
  }

  async deletePost(post: any): Promise<void> {
    try {
      if (!post || !post.postID) {
        console.error('Invalid post object or post ID:', post);
        return;
      }
  
      const postId = post.postID;
      await this.postService.deletePost(postId);
    } catch (error) {
      console.error('Error deleting post in component:', error);
    }
  }

  private detectChanges(): void {
    if (!(this['changeDetector'] && this['changeDetector']['detectChanges'])) {
      return;
    }
  
    // Manually detect changes
    this['changeDetector']['detectChanges']();
  }
}
