import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { HeaderMobileService } from '../services/header-mobile.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';
import { MenuService } from '../services/menu.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChatsService } from '../services/chats.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit, OnDestroy {
  public chats: any[] = [];
  public users: User[] = [];
  public searchFilter: string = '';
  public userUid: string = '';

  constructor(
    public mainService: MainService,
    public headerMobileService: HeaderMobileService,
    private databaseService: DatabaseService,
    private router: Router,
    public authService: AuthService,
    public menuService: MenuService,
    private firestore: AngularFirestore,
    public chatsService: ChatsService,
  ) {}

  
  ngOnInit(): void {
    this.mainService.showCalls = false;
    this.mainService.showCount = false;
    this.headerMobileService.getRoute();
    this.databaseService.getUid()
    // this.chatsService.getAllChats().subscribe((chats) => {
    //   this.chats = chats
    //   console.log(this.chats);
    // })
    this.databaseService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }

  ngOnDestroy(): void {
    this.mainService.showCalls = true;
    this.mainService.showCount = true;
    this.headerMobileService.searchActive = false;
  }

  redirectToMessage(user: string): void {
    this.userUid = user;
    if (window.outerWidth > 770) {
      this.router.navigate(['/desktop'], {
        queryParams: {
          user,
        },
      });
      this.menuService.relayComponent = true;
      this.menuService.startDesktop = false;
      this.menuService.showMessage = true;
    } else {
      this.router.navigate(['/message'], {
        queryParams: {
          user,
        },
      });
    }
  }
}