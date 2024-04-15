import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  Auth
} from 'firebase/auth';
import { StorageService } from './storage.service';
import { get } from 'lodash';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private reCaptchaVerifier: string;
  public verificationCode: string;
  private auth: Auth;
  public user: User | null = null;
  public phoneNumber = '';
  public countryCode = '+375';
  public errorMessage = '';
  public visibility = false;
  public userData: any;
  private pages: any = {
    mobile:[ '/verification','/registration','/', 'chat-list'],
    desktop: ['/verification','/registration','/'],
    inactive:['/verification','/search', '/chat-list', '/blog', '/message', '/search', '/desktop', '/profile']
  };

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    private storageService: StorageService
  ) {}

  get windowRef(): any {
    return window;
  }

  getAuth() {

    this.afAuth.authState.subscribe((user: any) => {
      this.userData= user;
      const getUrlUser = window.location.pathname;
      if (this.userData) {
        this.firestore.doc( `users/${user.uid}`).update({online:true});
    
        if (window.outerWidth > 920) {
          if (this.pages.mobile.find((item:string) => item === getUrlUser)) {
            this.router.navigate(['/desktop']);
          }
          localStorage.setItem('user', JSON.stringify(this.userData));
          this.userData = JSON.parse(localStorage.getItem('user')!);
        } else {
          if (this.pages.desktop.find((item:string) => item === getUrlUser)) {
            this.router.navigate(['/chat-list'])
          } 
          localStorage.setItem('user', JSON.stringify(this.userData));
          this.userData = JSON.parse(localStorage.getItem('user')!);
        }
      } else {
        if (this.pages.inactive.find((item:string) => item === getUrlUser)) {
          this.router.navigate(['/registration'])
        }
        localStorage.setItem('user', 'null');
        this.userData = JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  setLastLikedPost(postId: string) {
    localStorage.setItem('lastLikedPost', postId);
  }

  getUser(uid: string) {
    return this.firestore
      .collection<User>('users')
      .doc<User>(uid)
      .valueChanges()
      .pipe(take(1));
  }

  authPhone() {
    this.auth = getAuth();
    try {
      this.windowRef.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback(e: any) {
            console.log(e);
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
          },
        },
        this.auth
      );

      this.windowRef.recaptchaVerifier.render().then((widgetId: string) => {
        this.windowRef.recaptchaWidgetId = widgetId;
      });
    } catch (error) {
      console.log('Error creating RecaptchaVerifier:', error);
    }
  }

  sendLoginCode() {
    this.authPhone();
    const appVerifier = this.windowRef.recaptchaVerifier;
    const fullPhoneNumber = this.countryCode + this.phoneNumber;

    signInWithPhoneNumber(this.auth, fullPhoneNumber, appVerifier)
      .then((result) => {
        this.windowRef.confirmationResult = result;
        console.log(result.verificationId);
        this.router.navigate(['/verification']);
      })
      .catch((error) => {
        this.errorMessage = 'Something went wrong! Try again later!';
        console.log(error);
      });
  }

  resendLoginCode() {
    this.authPhone();
    const appVerifier = this.windowRef.recaptchaVerifier;
    const fullPhoneNumber = this.countryCode + this.phoneNumber;
    this.verificationCode = '';

    signInWithPhoneNumber(this.auth, fullPhoneNumber, appVerifier)
      .then((result) => {
        this.windowRef.confirmationResult = result;
        console.log(result.verificationId);
        this.visibility = false;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  callbackFunction(success: boolean) {
    if (success) {
      console.log('Verification successful');
    } else {
      console.log('Verification failed');
    }
  }

  SetUserData(user: User) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
      `users/${user.uid}`
    );
    return userRef.set(user, {
      merge: true,
    });
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then((result: any) => {
        this.user = result.user;
        console.log(result);

        if (this.user && this.user.verificationId === result.verificationId) {
          const nickName = `User${Math.floor(Math.random() * 100000)}`;

          const userData = {
            name: this.user.displayName,
            email: this.user.email,
            phone: this.user.phoneNumber,
            nickName: nickName,
            login: `@${nickName.toLowerCase()}`,
            uid: this.user.uid,
            provider: '',
            photoURL: this.user.photoURL,
            accessToken: this.user.accessToken,
            profileImage: this.user.profileImage,
            online: this.user.online,
          };
      
          this.getUser(this.user.uid).subscribe((user) => {
            if (!user) {
              this.SetUserData(userData)
                .then(() => {
                  if (window.outerWidth > 920) {
                    this.router.navigate(['/desktop']);
                  } else {
                    this.router.navigate(['/chat-list']);
                  }
                })
                .catch((error: string) => {
                  this.errorMessage = 'Failed to set user data';
                  console.log(error);
                });
            } else {
              if (window.outerWidth > 920) {
                this.router.navigate(['/desktop']);
              } else {
                this.router.navigate(['/chat-list']);
              }
            }
          });
        } else {
          this.callbackFunction(false);
        }
      })
      .catch((error: string) => {
        this.errorMessage = 'Please, try again!';
        console.log(error);
      });
  }
}
