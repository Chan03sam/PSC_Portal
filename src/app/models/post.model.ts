export interface Post {
    postID?: string;
    postContent: string;
    userName: string;
    userEmail?: string;
    userProfileImageURL?: string; // Add userProfileImageURL property
    timestamp: Date;
}
