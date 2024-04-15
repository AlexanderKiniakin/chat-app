import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { ChatsService } from '../services/chats.service';
import { DatabaseService } from '../services/database.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion } from '@angular/fire/firestore';
import { MessageComponent } from '../message/message.component';
import { 
  DataUrl, 
  NgxImageCompressService,
  UploadResponse,
} from 'ngx-image-compress';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {

  public inputImg: string | ArrayBuffer | null;



  constructor(
    public menuService: MenuService,
    public chatsService: ChatsService,
    private databaseService: DatabaseService,
    private firestore: AngularFirestore,
    private messageComponent: MessageComponent,
    private imageCompress: NgxImageCompressService,
    ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.chatsService.imageFile = '';
    this.chatsService.inputIcon = false;
  }
  
  async sendMessage() {
    if(!this.chatsService.addChatDescription.length && !this.chatsService.imageFile.length) {
      return;
    } else if (this.chatsService.imageFile.length || this.chatsService.addChatDescription.length >= 1) {
      this.messageComponent.smileCheck = false;
      const chatMessage = {
        description: this.chatsService.addChatDescription,
        date: new Date(),
        image: this.chatsService.imageFile,
        user: this.databaseService.userRef,
      }
      this.messageComponent.scrollDown();
      await this.firestore.doc(`chats/${this.chatsService.chatDocId}`).update(
        { messages: arrayUnion(chatMessage) },
      )
      this.chatsService.addChatDescription = ''
      this.chatsService.imageFile = '';
      this.chatsService.inputIcon = false;
    }
  }

  compressFile() {
    return this.imageCompress
      .uploadFile()
      .then(({ image, orientation }: UploadResponse) => {
        this.imageCompress
          .compressFile(image, orientation, 50, 50, 1600, 1600)
          .then((result: DataUrl) => {
            if(result.indexOf('jpeg') >= 0 || result.indexOf('png') >= 0  || result.indexOf('bmp') >= 0) {
              this.chatsService.inputIcon = true;
              this.chatsService.imageFile = result;
            }
          });
      });
  }

  smilesOpen() {
    if(!this.messageComponent.smileCheck) {
      this.messageComponent.smileCheck = true;
    } else {
      this.messageComponent.smileCheck = false;
    }
    
  }
}

