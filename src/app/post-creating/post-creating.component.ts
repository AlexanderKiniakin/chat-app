import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-post-creating',
  templateUrl: './post-creating.component.html',
  styleUrls: ['./post-creating.component.scss']
})
export class PostCreatingComponent {

  public addPostDescription = '';
  public inputImg: string | ArrayBuffer | null;
  public imageFile: File;
  public buttonDisabled: boolean = true;
  public buttonText: boolean = true;
  public preloader: boolean = false;

  constructor(
    public storageService: StorageService,
    private firestore: AngularFirestore,
    private router: Router,
    public databaseService: DatabaseService,
    ) {}

    choosePostImage(event: any, imageType: string) {
      const file: any = event.target.files[0];
      this.imageFile = file;
      const label: any = document.querySelector('.creating-post-container_input-block_img-block_label');
      let ext: any = "";

      if (file) {
        ext = file.name.split('.').pop()
      } else {
        return;
      }
      if (ext === 'png' || ext === 'jpeg' || ext === 'jpg' || ext === 'bmp') {
        this.buttonDisabled = false;
        this.buttonText = false;
        this.storageService.chooseFile(file);
        const fileReader = new FileReader();
          fileReader.onload = () => {
            return this.inputImg = fileReader.result;
          };
          fileReader.readAsDataURL(file);
          label.style.width = "100%"
      }
    }

    async addPostImage(folder: string) {
      if (this.addPostDescription.length >= 5 && this.imageFile){
        this.preloader = true;
        this.buttonDisabled = true;
        const collectionRef = this.firestore.collection('posts');
        const userRef = this.firestore.collection('users').doc(this.databaseService.userValue).ref;
        const postData = {
          date: new Date(),
          description: this.addPostDescription,
          id: '',
          image: '',
          user: userRef,
          likes: 0
        }
        postData.image = await this.storageService.addFile(folder)
        const docRef = await collectionRef.add(postData)
        await collectionRef.doc(docRef.id).update({id: docRef.id});
        this.routingComponent()
      }
    }

    routingComponent() {
      this.databaseService.pageRouting === 'blog' ? this.router.navigate(['/blog']) :
        this.router.navigate(['/my-posts'])
    }
}
