import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { User } from '../interfaces/user';
import { MenuService } from '../services/menu.service';
import { StorageService } from '../services/storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-setting-desktop',
  templateUrl: './profile-setting-desktop.component.html',
  styleUrls: ['./profile-setting-desktop.component.scss'],
})
export class ProfileSettingDesktopComponent implements OnInit, OnDestroy {
  public imageUrl = '';
  public profileImage: string | null = '';
  public user: User | null = null;
  private usersSubscribe: Object = {};
  public defaultImage: string = 'url(/assets/image/profile-default-image.png)';
  public qrData: string = '';
  public qrCodeEl: any;
  public qrCodeWidth: number;

  constructor(
    private databaseService: DatabaseService,
    public menuService: MenuService,
    public storageService: StorageService,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.databaseService.getUid();
    this.getAllUsers();
    this.menuService.relayComponent = false;
    this.qrCodeEl = document.querySelector('qrcode');


    if (window.outerWidth >= 770 && window.outerWidth < 1024) {
      this.qrCodeWidth = 75;
    }
    if (window.outerWidth >= 1024 && window.outerWidth < 1440) {
      this.qrCodeWidth = 100;
    }
    if (window.outerWidth >= 1440) {
      this.qrCodeWidth = 150;
    }

  }
  ngOnDestroy(): void {
    this.menuService.relayComponent = true;
  }

  getAllUsers() {
    this.usersSubscribe = this.databaseService.getUser().subscribe((user: User) => {
      this.user = user;
      this.qrData = `https://chat-app-4b82d.web.app/chat-list?user=${user.uid}`;
      console.log(user);
    });
  }

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
