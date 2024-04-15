import { 
  Component,
  OnInit, 
  OnDestroy,
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderMobileService } from '../services/header-mobile.service';
import { User } from '../interfaces/user';
import { ChatsService } from '../services/chats.service';
import { DatabaseService } from '../services/database.service';
import { CommonModule } from '@angular/common';
import * as _ from 'lodash';
import { arrayRemove } from '@angular/fire/firestore';
import { deleteObject, getStorage, ref } from '@angular/fire/storage';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
  private userParams: string;
  private paramMapSubscription: Subscription;
  public user: User | null = null;
  private scrollPage: any;
  private chatSubscribe: any;
  public messages: any[] = [];
  private chatCollection = this.db.collection('chats');
  private counter: number;
  private compDate: string = '';
  public smileCheck: boolean = false;
  public smiles: any[] = ['😀', '😉', '😁', '😆', '😅', '😂', '😊', '🙂', '😄', '🙃', '😇',
  '😃', '🤣', '😚', '😍', '😗', '😘', '🥰', '🤩', '😋', '😛', '😜', '😝', '🤪', '🤑', '🤔',
  '🤭', '🤗', '🤫', '😐', '😶', '😬', '😏', '😑', '😒', '🙄', '🤨', '🤐', '🤥', '😌', '😔',
  '😪', '😴', '🤤', '😷', '😵', '🥶', '🤧', '🤯', '🥴', '🤒', '🥵', '🤮', '🤕', '🤢', '🤠', 
  '🥳', '😎', '🤓', '🧐', '😕', '😖', '😧', '😫', '😱', '😞', '😯', '😮', '😭', '😟', '😓',
  '😩', '😢', '😲', '😨', '😳', '🙁', '😥', '😣', '😦', '😰', '🥺', '🥱', '💀', '👿', '😤',
  '😈', '😡', '😠', '🤬', '💩', '👽', '👻', '👺', '👹', '🤡', '🤖', '🙀', '😽', '😸', '😿',
  '😾', '😻', '😺', '😼', '😹', '🙉', '🙊', '🙈', '💟', '💭', '💞', '💌', '💯', '💋','👍',
  '👊', '👎', '🤛', '🤜', '✊', '👋', '🖖', '🖐', '🤚', '👌', '🤙', '🤞', '🤟', '🤘', '✌️', '🖕',
  '👆', '👇', '👈', '👉', '☝️', '👏', '🙏', '🙌', '🤝', '👀', '🐸', '🐓', '🐔', '🐀', '🐳',
  '🌹', '🌷', '🌺', '🥀', '💐', '☘️', '🎂', '🍺', '🍾', '🍹', '🍻', '🥃', '🥂', '☕️', '🦀',
  '🍔', '🍿', '🎉', '💸', '💵', '💶', '🔞', '💔', '💗',];

  constructor(
    private route: ActivatedRoute,
    public headerMobileService: HeaderMobileService,
    public chatsService: ChatsService,
    public databaseService: DatabaseService,
    private db: AngularFirestore,
  ) {}

  ngOnInit(): void {
    this.databaseService.getUid();
    this.headerMobileService.mainHeader = false;
    this.paramMapSubscription = this.route.queryParams.subscribe(
      (params) => {
        if (this.chatSubscribe){
          this.chatSubscribe.unsubscribe()
          this.messages = [];
          this.counter = -1;
          this.compDate = ''
          this.chatsService.inputIcon = false;
          this.chatsService.imageFile = '';
        }
        this.userParams = params['user'];
        this.ckeckChat(this.userParams);
      }
    );
    this.scrollPage = document.querySelector('.message-container');
  }

  ngOnDestroy(): void {
    this.headerMobileService.mainHeader = true;
    this.paramMapSubscription.unsubscribe();
    this.messages = [];
    this.chatSubscribe.unsubscribe();
  }

  compareDates(timestamp: any) {
    const date = new Date(timestamp * 1000).toLocaleDateString('ru-RU');
    const result = this.compDate.localeCompare(date) !== 0 ? true : false
    this.compDate = date;
    return result;
  }

  ckeckChat(userUid: string) {
    const messageData = {
      user: this.databaseService.userValue,
      companion: userUid,
      messages: [],
      id: "",
    };

  const findChat = this.db.collection('chats', (ref) => ref
    .where('user', 'in', [this.databaseService.userValue, userUid])
    .where('companion', 'in', [this.databaseService.userValue, userUid]))
    .valueChanges();
    
    this.chatSubscribe = findChat.subscribe(async (response: any) => {
      if(!response.length) {
        const docRef = await this.chatCollection.add(messageData);
        await this.chatCollection.doc(docRef.id).update({id: docRef.id});
        this.chatsService.chatDocId = docRef.id;
      } else if(response[0].messages.length !== this.counter) {
        this.counter = response[0].messages.length
        this.chatsService.chatDocId = response[0].id;
        this.getChat(response[0].messages);
      }
    });
  }

  getChat(chat: any[]) {
    this.messages = _.differenceWith(chat, this.messages, _.isEqual);
    this.messages.forEach((item: any) => {
        const date = this.compareDates(item.date.seconds)
        item.dateicon = date;
    });
    this.compDate = '';
    this.scrollDown()
  }

  scrollDown() {
    setTimeout(() => {
      this.scrollPage.scrollTop = this.scrollPage.scrollHeight
    }, 100);
  }

  onRightClick(message: any) {
    delete message.dateicon
    this.chatCollection.doc(this.chatsService.chatDocId).update(
      { messages: arrayRemove(message) },
    )
    return false
  }

  getSmile(smile: any) {
    this.chatsService.addChatDescription += smile;
    this.smileCheck = false;
  }
}