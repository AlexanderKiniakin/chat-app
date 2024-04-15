import { Injectable } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  title = 'angular-firebase';
  public file: any = {};
  public uploadImage = false;
  public progress: number;
  public showPreloader = false;
  public showProfileImagePreloader = false;

  constructor(public storage: Storage) {}

  chooseFile(e: void) {
    this.file = e;
  }

  addFile(folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(this.storage, `${folder}/${this.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, this.file);

      if (folder === 'users_profileImage') {
        this.showProfileImagePreloader = true;
      } else {
        this.showPreloader = true;
      }

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          this.progress = Math.trunc(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log('Upload is ' + this.progress + '% done');
        },
        (error) => {
          console.log(error.message);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            })
            .catch((error) => {
              console.log(error.message);
              reject(error);
            })
            .finally(() => {
              if (folder === 'users_profileImage') {
                this.showProfileImagePreloader = false;
              } else {
                this.showPreloader = false;
              }
            });
        }
      );
    });
  }
}
