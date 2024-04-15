import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  Reference,
} from '@angular/fire/compat/firestore';
import { map, Observable, pipe, take } from 'rxjs';
import * as _ from 'lodash';
import { user } from '@angular/fire/auth';
import { arrayRemove, arrayUnion, increment } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { getStorage, ref, deleteObject } from '@angular/fire/storage';
import { User } from '../interfaces/user';
import { Post } from '../interfaces/post'

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public posts: any[] = [];
  private firestore: AngularFirestore;
  private usersCollection: AngularFirestoreCollection<any>;
  public snapshotSubscribe: any;
  public responseArray: any[] = [];
  public likeCounter: number;
  public userSubscribe: {} = {};
  public preloader: boolean;
  public pageRouting: string;
  public noPosts: boolean = false;
  public commentsModal: boolean = false;
  public postRef: any;
  public commentsSnapshotSubscribe: any;
  public comments: any[] = [];
  public preloaderComments: boolean = true;
  public responseCommentsArray: any[] = [];
  public getCommentPreloader: boolean = false;
  public visibleMenu: boolean = false;
  public likeAnimation: { [key: string]: boolean } = {};

  constructor(
    private db: AngularFirestore, 
    private auth: AuthService,
    ) {
    this.firestore = db;
    this.usersCollection = this.firestore.collection('users');
  }

  public userPhone: string;
  public userUid: User;
  public userValue: string;
  public userRef: any;

  getPosts(firstDoc: Document): Observable<any[]> {
    return this.db
      .collection('posts', (ref) =>
        ref.limit(3).orderBy('date', 'desc').startAt(firstDoc)
        ).valueChanges({ idField: 'id' });
  }

  blog() {
    const postsRef = this.db.collection('posts', (ref) => ref.orderBy('date', 'desc'));
    return this.snapshotSub(postsRef, 'blog')
  }

  userBlog() {
    const postsRef = this.db.collection('posts', (ref) => ref.where('user', '==', this.userRef)
    .orderBy('date', 'desc'));
    return this.snapshotSub(postsRef, 'userBlog')
  }

  getAllPosts(doc: Document) {
    this.getPosts(doc).pipe(take(1)).subscribe((blog: any) => {
      blog.forEach(async (element: any) => {
        await this.getPostUser(element.user?.path).pipe(take(1))
        .subscribe((user: any) => element.user = user);
        element.shareButton = false;
          if(!this.posts.find((item: Post) => element.id === item.id)) {
            this.posts.push(element);
            this.preloader = false;
          }
      });
    });
  }

  getFirstDoc(startDoc: number, functionName: string) {
    if (functionName === 'blog') {
      this.getAllPosts(this.responseArray[startDoc]?.payload.doc);
    } else if (functionName === 'userBlog') {
      this.getAllUserPosts(this.responseArray[startDoc]?.payload.doc);
    }
  }

  getOneDoc(doc: Document) {
    this.getPost(doc).pipe(take(1)).subscribe((blog: any) => {
      blog.forEach(async (element: any) => {
        await this.getPostUser(element.user?.path)
        .pipe(take(1)).subscribe((user: any) => element.user = user);
          this.posts.unshift(element);
      });
    });
  }

  getPost(doc: Document): Observable<object> {
    return this.db.collection('posts', (ref) =>
        ref.limit(1).orderBy('date', 'desc').startAt(doc)
      ).valueChanges({ idField: 'id' });
  }

  getUser(): Observable<any> {
    return this.db.collection('users').doc(this.userValue).valueChanges();
  }

  getAllUsers(): Observable<any[]> {
    return this.usersCollection.valueChanges()
      .pipe(map((users) => users.map((users: User) => users)));
  }

  getPostUser(user: string) {
    return this.db.doc(user).valueChanges();
  }

  setLike(postId: string, userId: string) {

    const likeCount: any = document.querySelector(`[post-id="ng${postId}"]`);

    this.auth.getUser(userId).pipe(take(1)).subscribe((user: any) => {
      if (user.like.find((item: any) => item == postId)) {
        this.firestore.doc(`users/${userId}`).set(
          { like: arrayRemove(postId) },
          { merge: true }
        );
        this.firestore.doc(`posts/${postId}`).set(
          { likes: increment(-1) },
          { merge: true }
        );
        if (likeCount) {
          const currentLikes = Number(likeCount.innerText);
          likeCount.innerText = String(currentLikes - 1);
        }
      } else {
        this.firestore.doc(`users/${userId}`).set(
          { like: arrayUnion(postId) },
          { merge: true }
        );
        this.firestore.doc(`posts/${postId}`).set(
          { likes: increment(+1) },
          { merge: true }
        );
        if (likeCount) {
          const currentLikes = Number(likeCount.innerText);
          likeCount.innerText = String(currentLikes + 1);
        }
      }
      this.likeAnimation[postId] = true;

      setTimeout(() => {
        this.likeAnimation[postId] = false;
      }, 1000);
    });
  }

  setCommentLike(commentId: string, userId: string) {

    const likeCount: any = document.querySelector(`[comment-id="ng${commentId}"]`);

    this.auth.getUser(userId).pipe(take(1)).subscribe((user: any) => {
      if (user.commentLike.find((item: any) => item == commentId)) {
        this.firestore.doc(`users/${userId}`).set(
          { commentLike: arrayRemove(commentId) },
          { merge: true }
        );
        this.firestore.doc(`comments/${commentId}`).set(
          { likes: increment(-1) },
          { merge: true }
        );
        if (likeCount) {
          const currentLikes = Number(likeCount.innerText);
          likeCount.innerText = String(currentLikes - 1);
        }
      } else {
        this.firestore.doc(`users/${userId}`).set(
          { commentLike: arrayUnion(commentId) },
          { merge: true }
        );
        this.firestore.doc(`comments/${commentId}`).set(
          { likes: increment(+1) },
          { merge: true }
        );
        if (likeCount) {
          const currentLikes = Number(likeCount.innerText);
          likeCount.innerText = String(currentLikes + 1);
        }
      }
    });
  }

  deletePost(deleteDoc: Document) {
    this.posts = this.posts.reduce((acc, item) => {
      if(item.id !== deleteDoc) {
        acc.push(item)
      }
      return acc
    }, [])
  }

  getUid() {
    this.userUid = JSON.parse(window.localStorage.getItem('user')!);
    this.userValue = this.userUid.uid;
    this.userRef = this.firestore.collection("users").doc(this.userValue).ref;
  }

  getPostRef(post: any) {
    this.postRef = this.firestore.collection("posts").doc(post.id).ref;
  }

  snapshotSub(postsRef: any, functionName: string) {
    const snapshot: any = postsRef;
    this.snapshotSubscribe = snapshot.snapshotChanges().subscribe((response: any) => {
      if (!response.length) {
        this.posts = [];
        this.preloader = false;
        this.responseArray = response;
        this.noPosts = true;
        return;
      } else if (response.length > 0 &&
        this.posts.length === 0 ) {
          this.responseArray = response
          this.noPosts = false;
          this.getFirstDoc(0, functionName);
      } else if (response.length > this.responseArray.length &&
        this.posts.length !== 0) {
        response.forEach((item: any) => {
          if(!this.responseArray.find((element: any) => element.payload.doc.id === item.payload.doc.id)) {
            this.getOneDoc(item.payload.doc)
            this.responseArray = response
            this.noPosts = false;
          }
        })
      } else if (response.length < this.responseArray.length &&
        this.posts.length !== 0) {
          this.responseArray.forEach((item: any) => {
            if(!response.find((element: any) => element.payload.doc.id === item.payload.doc.id)) {
              this.deletePost(item.payload.doc.id)
              this.responseArray = response;
            }
          })
        }
    });
  }

  getUserPosts(firstDoc: Document) {
    return this.firestore.collection('posts', (ref) =>
    ref.where('user', '==', this.userRef).orderBy('date', 'desc')
    .startAt(firstDoc)).valueChanges().pipe(take(1));
  }

  getAllUserPosts(doc: Document) {
    this.getUserPosts(doc).pipe(take(1)).subscribe((blog: any) => {
      blog.forEach(async (element: any) => {
        await this.getPostUser(element.user?.path).pipe(take(1))
        .subscribe((user: any) => element.user = user);
          if(!this.posts.find((item: any) => element.id === item.id)) {
            element.modal = false;
            this.posts.push(element);
            this.preloader = false;
          }
      });
    });
  }

  deleteOnePost(post: Post) {
    deleteObject(ref(getStorage(), post.image)).then(() => {
    }).catch((error) => {
      console.log(error);
    });
    this.db.collection('posts').doc(post.id).delete()
  }

  getPostComments() {
    return this.db.collection('comments', (ref) => ref.where('post', '==', this.postRef)
    .orderBy('date', 'desc'));
  }

  commentsSubscribe() {
    const snapshot: any = this.getPostComments();
    this.commentsSnapshotSubscribe = snapshot.snapshotChanges().subscribe((response: any) => {
      if (!response.length) {
        this.visibleMenu = true;
        this.comments = [];
        this.preloaderComments = false;
        this.responseCommentsArray = response;
        this.getCommentPreloader = false;
        return;
      } else if (response.length > 0 &&
        this.comments.length === 0 ) {
          this.responseCommentsArray = response
          this.getCommentsFirstDoc(0);
      } else if (response.length > this.responseCommentsArray.length &&
        this.comments.length !== 0) {
        response.forEach((item: any) => {
          if(!this.responseCommentsArray.find((element: any) => element.payload.doc.id === item.payload.doc.id)) {
            this.getOneComment(item.payload.doc)
            this.responseCommentsArray = response
          }
        })
      } else if (response.length < this.responseCommentsArray.length &&
        this.comments.length !== 0) {
          this.visibleMenu = true;
          this.responseCommentsArray.forEach((item: any) => {
            if(!response.find((element: any) => element.payload.doc.id === item.payload.doc.id)) {
              this.deleteComment(item.payload.doc.id)
              this.responseCommentsArray = response;
            }
          })
        }
    });
  }

  getComments(firstDoc: Document): Observable<any[]> {
    return this.db
      .collection('comments', (ref) =>
        ref.limit(15).orderBy('date', 'desc').startAt(firstDoc)
        ).valueChanges({ idField: 'id' });
  }

  getAllComments(doc: Document) {
    this.getComments(doc).pipe(take(1)).subscribe((comment: any) => {
      comment.forEach(async (element: any) => {
        await this.getPostUser(element.user?.path).pipe(take(1))
        .subscribe((user: any) => element.user = user);
          if(!this.comments.find((item: Post) => element.id === item.id)) {
            if(this.userValue === element.user.id) {
              element.icon = true;
              element.modal = false;
            } else {
              element.icon = false;
            }
            this.comments.push(element);
            this.preloaderComments = false;
            this.getCommentPreloader = false;
            this.visibleMenu = true;
          }
      });
    });
  }

  getCommentsFirstDoc(startDoc: number) {
      this.getAllComments(this.responseCommentsArray[startDoc]?.payload.doc);
  }

  getOneComment(doc: Document) {
    this.getPostComment(doc).pipe(take(1)).subscribe((comment: any) => {
      comment.forEach(async (element: any) => {
        await this.getPostUser(element.user?.path)
        .pipe(take(1)).subscribe((user: any) => element.user = user);
          if(this.userValue === element.user.id) {
              element.icon = true;
              element.modal = false;
            } else {
              element.icon = false;
            }
          this.comments.unshift(element);
          this.getCommentPreloader = false;
          this.visibleMenu = true;
      });
    });
  }

  getPostComment(doc: Document): Observable<object> {
    return this.db.collection('comments', (ref) =>
        ref.limit(1).orderBy('date', 'desc').startAt(doc)
      ).valueChanges({ idField: 'id' });
  }

  deleteComment(deleteDoc: Document) {
    this.comments = this.comments.reduce((acc, item) => {
      if(item.id !== deleteDoc) {
        acc.push(item)
      }
      return acc
    }, [])
  }

  deleteOneComment(comment: Post) {
    this.db.collection('comments').doc(comment.id).delete()
  }

  getPostLink(id: string) {
    return this.firestore.collection("posts").doc(id).valueChanges({ idField: 'id' });
  }

  getOnePost(id: string) {
    this.getPostLink(id).pipe(take(1)).subscribe(async (post: any) => {
      await this.getPostUser(post.user?.path).pipe(take(1))
        .subscribe((user: any) => post.user = user);
      this.posts.push(post)
      this.preloader = false;
    })
  }
}