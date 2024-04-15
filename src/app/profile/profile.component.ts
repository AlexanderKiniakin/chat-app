import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { HeaderMobileService } from '../services/header-mobile.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../interfaces/user';
import { visitAll } from '@angular/compiler';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public imageUrl = '';
  public profileImage: string | null = '';
  public user: User | null = null;
  private usersSubscribe: any;
  public defaultImage = 'url(/assets/image/profile-default-image.png)';
  public onlineImage = 'url(/assets/icon/profil-edit.png)';

  constructor(
    public storageService: StorageService,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private firestore: AngularFirestore,
    private headerMobileService: HeaderMobileService
  ) {}

  ngOnInit() {
    this.databaseService.getUid();
    this.getAllUsers();
    this.headerMobileService.getRoute();
  }

  getAllUsers() {
    this.usersSubscribe = this.databaseService
      .getUser()
      .subscribe((user: User) => {
        this.user = user;
        console.log(user);
      });
  }

  logOut() {
    this.afAuth.signOut();
  }

  getOnline() {}

  uploadImage(event: any, folder: string, imageType: string) {
    const file: any = event.target.files[0];
    console.log(file);
    if (file) {
      this.storageService.chooseFile(file);
      this.storageService
        .addFile(folder)
        .then((downloadUrl: string) => {
          this.imageUrl = downloadUrl;
          this.afAuth.currentUser.then((user) => {
            if (user) {
              if (imageType === 'profileImage') {
                this.firestore.doc(`users/${user.uid}`).update({
                  profileImage: downloadUrl,
                });
              } else if (imageType === 'photoURL') {
                this.firestore.doc(`users/${user.uid}`).update({
                  photoURL: downloadUrl,
                });
              }
            }
          });
        })
        .catch((error: any) => {
          console.log(error.message);
        });
    }
  }
}
