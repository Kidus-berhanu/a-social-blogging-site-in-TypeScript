class BloggingService {
  private users: User[] = [
    { id: 1, username: 'Kidus Berhanu', email: 'Kidus_berhanu@example.com', password: 'password123' },
    { id: 2, username: 'Kidus Berhanu', email: 'Kidus_berhanu@example.com', password: 'password2222' }
  ];

  private posts: Post[] = [
    { 
      id: 1, 
      title: ' yay this is My First Post', 
      content: 'This is my first blog post.', 
      author: this.users[0], 
      createdAt: new Date('1999-07-01'), 
      updatedAt: new Date('1999-07-01'), 
      likes: 0, 
      comments: []
    },
    { 
      id: 2, 
      title: 'My Second Post', 
      content: 'This is my second blog post.', 
      author: this.users[1], 
      createdAt: new Date('2003-01-12'), 
      updatedAt: new Date('2023-11-02'), 
      likes: 0, 
      comments: []
    }
  ];

  private comments: Comment[] = [
    { 
      id: 1, 
      content: 'Great post!', 
      author: this.users[1], 
      post: this.posts[0], 
      createdAt: new Date('2023-01-03'), 
      updatedAt: new Date('2023-01-03'), 
      likes: 0 
    }
  ];

  public createPost(post: Post): Post {
    const newPost = { ...post, id: this.posts.length + 1, createdAt: new Date(), updatedAt: new Date(), likes: 0, comments: [] };
    this.posts.push(newPost);
    return newPost;
  }

  public getPost(postId: number): Post {
    const post = this.posts.find(p => p.id === postId);
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }
    return post;
  }

  public updatePost(post: Post): Post {
    const index = this.posts.findIndex(p => p.id === post.id);
    if (index < 0) {
      throw new Error(`Post with ID ${post.id} not found`);
    }
    const updatedPost = { ...this.posts[index], ...post, updatedAt: new Date() };
    this.posts[index] = updatedPost;
    return updatedPost;
  }

  public deletePost(postId: number): void {
    const index = this.posts.findIndex(p => p.id === postId);
    if (index < 0) {
      throw new Error(`Post with ID ${postId} not found`);
    }
    this.posts.splice(index, 1);
  }

  public createComment(comment: Comment): Comment {
    const newComment = { ...comment, id: this.comments.length + 1, createdAt: new Date(), updatedAt: new Date(), likes: 0 };
    this.comments.push(newComment);
    const post = this.getPost(comment.post.id);
    post.comments.push(newComment);
    return newComment;
  }

  public getComment(commentId: number): Comment {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) {
      throw new Error(`Comment with ID ${commentId} not found`);
    }
    return comment;
  }

    public updateComment(comment: Comment): Comment {
    const index = this.comments.findIndex(c => c.id === comment.id);
    if (index < 0) {
      throw new Error(`Comment with ID ${comment.id} not found`);
    }
    const updatedComment = { ...this.comments[index], ...comment, updatedAt: new Date() };
    this.comments[index] = updatedComment;
    return updatedComment;
  }

  public deleteComment(commentId: number): void {
    const index = this.comments.findIndex(c => c.id === commentId);
    if (index < 0) {
      throw new Error(`Comment with ID ${commentId} not found`);
    }
    const comment = this.comments[index];
    const post = this.getPost(comment.post.id);
    const commentIndex = post.comments.findIndex(c => c.id === commentId);
    post.comments.splice(commentIndex, 1);
    this.comments.splice(index, 1);
  }
}
// Find posts by author
public findPostsByAuthor(author: User): Post[] {
  return this.posts.filter(p => p.author.id === author.id);
}

// Find posts by keyword
public findPostsByKeyword(keyword: string): Post[] {
  return this.posts.filter(p => p.title.includes(keyword) || p.content.includes(keyword));
}

// Find comments by author
public findCommentsByAuthor(author: User): Comment[] {
  return this.comments.filter(c => c.author.id === author.id);
}

// Find comments by post
public findCommentsByPost(post: Post): Comment[] {
  return this.comments.filter(c => c.post.id === post.id);
}

// Add a like to a post
public addPostLike(postId: number, userId: number): Post {
  const post = this.getPost(postId);
  if (post.likes.includes(userId)) {
    throw new Error(`User ${userId} has already liked post ${postId}`);
  }
  post.likes.push(userId);
  return post;
}

// Remove a like from a post
public removePostLike(postId: number, userId: number): Post {
  const post = this.getPost(postId);
  const index = post.likes.indexOf(userId);
  if (index < 0) {
    throw new Error(`User ${userId} has not liked post ${postId}`);
  }
  post.likes.splice(index, 1);
  return post;
}

// Add a like to a comment
public addCommentLike(commentId: number, userId: number): Comment {
  const comment = this.getComment(commentId);
  if (comment.likes.includes(userId)) {
    throw new Error(`User ${userId} has already liked comment ${commentId}`);
  }
  comment.likes.push(userId);
  return comment;
}

// Remove a like from a comment
public removeCommentLike(commentId: number, userId: number): Comment {
  const comment = this.getComment(commentId);
  const index = comment.likes.indexOf(userId);
  if (index < 0) {
    throw new Error(`User ${userId} has not liked comment ${commentId}`);
  }
  comment.likes.splice(index, 1);
  return comment;
}
// Get a user's feed of posts from people they follow
public getUserFeed(userId: number): Post[] {
  const user = this.getUser(userId);
  const following = user.following.map(u => u.id);
  return this.posts.filter(p => following.includes(p.author.id));
}

// Get the most popular posts (sorted by number of likes)
public getPopularPosts(): Post[] {
  return this.posts.sort((a, b) => b.likes.length - a.likes.length);
}

// Get the most recent posts (sorted by date)
public getRecentPosts(): Post[] {
  return this.posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Get the most active users (sorted by number of posts)
public getMostActiveUsers(): User[] {
  const userPosts = this.posts.reduce((acc, post) => {
    const authorId = post.author.id;
    acc[authorId] = acc[authorId] ? acc[authorId] + 1 : 1;
    return acc;
  }, {});
  return this.users.sort((a, b) => (userPosts[b.id] || 0) - (userPosts[a.id] || 0));
}

// Follow a user
public followUser(userId: number, targetUserId: number): void {
  const user = this.getUser(userId);
  const targetUser = this.getUser(targetUserId);
  if (user.following.some(u => u.id === targetUserId)) {
    throw new Error(`User ${userId} is already following user ${targetUserId}`);
  }
  user.following.push(targetUser);
}

// Unfollow a user
public unfollowUser(userId: number, targetUserId: number): void {
  const user = this.getUser(userId);
  const index = user.following.findIndex(u => u.id === targetUserId);
  if (index < 0) {
    throw new Error(`User ${userId} is not following user ${targetUserId}`);
  }
  user.following.splice(index, 1);
}
public searchPosts(query: string): Post[] {
  const queryWords = query.toLowerCase().split(' ');
  return this.posts.filter(post => {
    // Check if any of the query words appear in the post title, body, or tags
    return queryWords.some(word => 
      post.title.toLowerCase().includes(word) ||
      post.body.toLowerCase().includes(word) ||
      post.tags.some(tag => tag.toLowerCase().includes(word))
    );
  });
}
export class SocialBlogging {
  private users: User[];
  private posts: Post[];
  private comments: Comment[];
  private bookmarks: { [userId: number]: Post[] };  // new bookmarks property

  constructor() {
    this.users = [];
    this.posts = [];
    this.comments = [];
    this.bookmarks = {};  // initialize empty bookmarks object
  }

  // ...existing functions...

  // Add a post to a user's bookmarks
  public bookmarkPost(userId: number, postId: number): void {
    const user = this.getUser(userId);
    const post = this.getPost(postId);
    if (!this.bookmarks[userId]) {
      this.bookmarks[userId] = [];  // create bookmarks array if it doesn't exist yet
    }
    if (this.bookmarks[userId].some(p => p.id === postId)) {
      throw new Error(`Post ${postId} is already bookmarked by user ${userId}`);
    }
    this.bookmarks[userId].push(post);
  }

  // Remove a post from a user's bookmarks
  public unbookmarkPost(userId: number, postId: number): void {
    const user = this.getUser(userId);
    const index = this.bookmarks[userId]?.findIndex(p => p.id === postId);
    if (index === undefined || index < 0) {
      throw new Error(`Post ${postId} is not bookmarked by user ${userId}`);
    }
    this.bookmarks[userId].splice(index, 1);
  }

  // Get a user's list of bookmarked posts
  public getBookmarkedPosts(userId: number): Post[] {
    if (!this.bookmarks[userId]) {
      return [];
    }
    return this.bookmarks[userId];
  }
}
// Report a post for inappropriate content
public reportPost(postId: number, userId: number, reason: string): void {
  const post = this.getPost(postId);
  const user = this.getUser(userId);
  if (post.reports.some(r => r.user.id === userId)) {
    throw new Error(`Post ${postId} has already been reported by user ${userId}`);
  }
  post.reports.push({ user, reason });
  if (post.reports.length >= 3) {
    post.status = PostStatus.Inactive;
    const author = post.author;
    author.posts = author.posts.filter(p => p.id !== postId);
  }
}

// Report a comment for inappropriate content
public reportComment(commentId: number, userId: number, reason: string): void {
  const comment = this.getComment(commentId);
  const user = this.getUser(userId);
  if (comment.reports.some(r => r.user.id === userId)) {
    throw new Error(`Comment ${commentId} has already been reported by user ${userId}`);
  }
  comment.reports.push({ user, reason });
  if (comment.reports.length >= 3) {
    const post = this.getPost(comment.post.id);
    const commentIndex = post.comments.findIndex(c => c.id === commentId);
    post.comments.splice(commentIndex, 1);
  }
}

// Suspend a user's account
public suspendUser(userId: number, moderatorId: number, reason: string): void {
  const user = this.getUser(userId);
  const moderator = this.getUser(moderatorId);
  if (user.status === UserStatus.Suspended) {
    throw new Error(`User ${userId} is already suspended`);
  }
  user.status = UserStatus.Suspended;
  user.suspension = { moderator, reason, suspendedAt: new Date() };
  user.posts.forEach(p => {
    p.status = PostStatus.Inactive;
    p.comments.forEach(c => c.status = CommentStatus.Inactive);
  });
}
interface Notification {
  type: string;
  message: string;
  postId?: number;
  userId?: number;
}

class SocialBloggingApp {
  private notifications: Notification[] = [];

  // ...

  // Create a new notification and add it to the notifications list
  private createNotification(type: string, message: string, postId?: number, userId?: number) {
    const notification: Notification = { type, message };
    if (postId) {
      notification.postId = postId;
    }
    if (userId) {
      notification.userId = userId;
    }
    this.notifications.push(notification);
  }

  // Get a user's notifications
  public getNotifications(userId: number): Notification[] {
    return this.notifications.filter(notification => notification.userId === userId);
  }

  // Clear a user's notifications
  public clearNotifications(userId: number): void {
    this.notifications = this.notifications.filter(notification => notification.userId !== userId);
  }

  // Send a notification to a user when a post they follow is updated
  public sendPostUpdateNotification(post: Post, userId: number): void {
    const message = `The post "${post.title}" has been updated by ${post.author.name}.`;
    this.createNotification('post-update', message, post.id, userId);
  }

  // Send a notification to a user when their post receives a new comment or like
  public sendPostActivityNotification(post: Post, activityType: string, userId: number): void {
    const message = `Your post "${post.title}" has received a new ${activityType} from ${post.activity[activityType].lastUser.name}.`;
    this.createNotification('post-activity', message, post.id, userId);
  }
}
interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
}

interface User {
  id: number;
  name: string;
  email: string;
  messages: Message[];
}

class MessagingService {
  private users: User[] = [];
  private messages: Message[] = [];
  private nextUserId = 1;
  private nextMessageId = 1;

  // Register a new user
  public registerUser(name: string, email: string): User {
    const user: User = {
      id: this.nextUserId++,
      name,
      email,
      messages: [],
    };
    this.users.push(user);
    return user;
  }

  // Send a message from one user to another
  public sendMessage(senderId: number, receiverId: number, content: string): Message {
    const sender = this.getUser(senderId);
    const receiver = this.getUser(receiverId);
    const message: Message = {
      id: this.nextMessageId++,
      senderId,
      receiverId,
      content,
      createdAt: new Date(),
    };
    sender.messages.push(message);
    receiver.messages.push(message);
    this.messages.push(message);
    return message;
  }

  // Get all messages sent between two users
  public getMessages(senderId: number, receiverId: number): Message[] {
    return this.messages.filter(
      m => (m.senderId === senderId && m.receiverId === receiverId) || (m.senderId === receiverId && m.receiverId === senderId)
    );
  }

  // Get a user by their ID
  private getUser(userId: number): User {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    return user;
  }
}
// Get all users
public getUsers(): User[] {
return this.users;
}

// Get all comments
public getComments(): Comment[] {
return this.comments;
}

// Get all tags
public getTags(): string[] {
const allTags = this.posts.map(p => p.tags).flat();
return [...new Set(allTags)];
}

// Get posts by tag
public getPostsByTag(tag: string): Post[] {
return this.posts.filter(p => p.tags.includes(tag));
}

// Get posts by author
public getPostsByAuthor(authorId: number): Post[] {
return this.posts.filter(p => p.author.id === authorId);
}

// Get posts by date range
public getPostsByDateRange(startDate: Date, endDate: Date): Post[] {
return this.posts.filter(p => p.createdAt >= startDate && p.createdAt <= endDate);
}

// Get users by search query
public getUsersBySearchQuery(query: string): User[] {
const regex = new RegExp(query, 'i');
return this.users.filter(u => regex.test(u.username));
}

// Get posts by search query
public getPostsBySearchQuery(query: string): Post[] {
const regex = new RegExp(query, 'i');
return this.posts.filter(p => regex.test(p.title) || regex.test(p.content));
}

// Get comments by search query
public getCommentsBySearchQuery(query: string): Comment[] {
const regex = new RegExp(query, 'i');
return this.comments.filter(c => regex.test(c.content));
}

// Get notifications for a user
public getNotifications(userId: number): Notification[] {
const user = this.getUser(userId);
return user.notifications;
}

// Mark notification as read
public markNotificationAsRead(userId: number, notificationId: number): void {
const user = this.getUser(userId);
const notification = user.notifications.find(n => n.id === notificationId);
if (notification) {
notification.read = true;
}
}

// Send a direct message
public sendDirectMessage(fromUserId: number, toUserId: number, message: string): void {
const fromUser = this.getUser(fromUserId);
const toUser = this.getUser(toUserId);
const conversation = this.getConversation(fromUserId, toUserId);
if (!conversation) {
const newConversation = {
participants: [fromUser, toUser],
messages: []
};
this.conversations.push(newConversation);
}
const newMessage: Message = {
id: this.messages.length + 1,
from: fromUser,
to: toUser,
content: message,
createdAt: new Date()
};
conversation.messages.push(newMessage);
this.messages.push(newMessage);
}

// Get conversation between two users
public getConversation(userId1: number, userId2: number): Conversation | undefined {
return this.conversations.find(c => {
const participants = c.participants.map(p => p.id);
return participants.includes(userId1) && participants.includes(userId2);
});
}

// Get messages for a conversation
public getMessagesForConversation(conversation: Conversation): Message[] {
return conversation.messages;
}

// Get unread messages for a user
public getUnreadMessages(userId: number): Message[] {
return this.messages.filter(m => !m.read && m.to.id === userId);
}

// Mark message as read
public markMessageAsRead(userId: number, messageId: number): void {
const message = this.messages.find(m => m.id === messageId);
if (message && message.to.id === userId) {
message.read = true;
}
}

