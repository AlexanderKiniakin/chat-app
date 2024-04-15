import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public changeIcon = false;
  public relayComponent = true;
  public startDesktop = true;
  public userParams: User | null = null;
  private changeComponentUnsubscribe: {} = {};
  public showMessage = true;

  constructor(private route: ActivatedRoute,
    private router: Router,){}

    public menuItem: any[] = [{
      id: 0,
      img: "assets/image/home.png",
      activeImg: "assets/image/home-blue.png",
      title: "Home",
      url: "/blog",
      active: false,
      
      }, 
    {
      id: 1,
      img: "assets/image/chat.png",
      activeImg: "assets/image/chat-blue.png",
      title: "Chat",
      url: "/chat-list",
      active: false,
      
    }, 
    {
      id: 2,
      img: "assets/image/search.png",
      activeImg: "assets/image/search-blue.png",
      title: "Search",
      url: "/search",
      active: false,
      
    }, 
    {
      id: 3,
      img: "assets/image/profile.png",
      activeImg: "assets/image/profile-blue.png",
      title: "Profile",
      url: "/profile",
      active: false,
      
    }];

    public menuSetting: any[] = [{
      id: 0,
      img: "/assets/icon/edit-profile.png",
      title: "Edit profile",
      url: "/desktop/profile-setting-desktop",
    }, {
      id: 1,
      img: "/assets/icon/notifications.png",
      title: "Notifications",
      url: "/desktop/chat-list",
    }, {
      id: 2,
      img: "/assets/icon/privacy-and-security.png",
      title: "Privacy and security",
      url: "",
    }, {
      id: 3,
      img: "/assets/icon/chat-settings.png",
      title: "Chat settings",
      url: "",
    }, {
      id: 4,
      img: "/assets/icon/language-settings.png",
      title: "Language settings",
      url: "",
      active: true,
    }, {
      id: 5,
      img: "/assets/icon/timeChat-FAQ.png",
      title: "Time chat FAQ",
      url: "",
    }, {
      id: 6,
      img: "/assets/icon/to-communicate.png",
      title: "To communicate",
      url: "",
    }]
 
    changeComponent() {
      this.changeComponentUnsubscribe = this.route.queryParams.subscribe(
        (params) => {
          if (params['user']) {
            this.userParams = params['user'];
          }
        }
      );
      this.relayComponent = false;
      this.startDesktop = false;
      this.showMessage = false;
    }
    returnStartPage() {
      if (!this.userParams) {
        this.showMessage = false;
        this.startDesktop = true;
      } else {
        this.showMessage = true;
      }
    }



}
