import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { HeaderMobileService } from '../services/header-mobile.service';
import { MainService } from '../services/main.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpParams } from "@angular/common/http";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit  {

  likeClicked = false;

  public eventCounter: number;
  private windowHeight: any = document.documentElement.clientHeight;
  private lazyObjectsPosition: any [] = [];
  public postLiked = false;
  public user: any;
  private scrollEvent: boolean = true;
  private userSubscribe: any;
  public shareUrl: string

  constructor(
    public databaseService: DatabaseService,
    private headerMobileService: HeaderMobileService,
    public mainService: MainService,
    public authService: AuthService,
    private router: Router,
    ) {}

  @ViewChildren('divRef') divRef: QueryList<ElementRef>;
  @ViewChildren('shareButton') shareButton: QueryList<ElementRef>;
  @ViewChildren('descroptionTXT') descroptionTXT: QueryList<ElementRef>;

  @HostListener('window:scroll', [])
  onScrollEvent() {
    this.eventCounter = this.databaseService.posts.length - 1;
    if (this.scrollEvent) {
      this.lazyObjectsPosition = this.divRef.map((post: ElementRef) => {
        return post.nativeElement.offsetTop
      });
      this.scrollEvent = false;
    }
    if (
      scrollY + this.windowHeight >=
        this.lazyObjectsPosition[this.eventCounter] ||
      this.databaseService.posts.length < 4
    ) {
      if (
        this.databaseService.responseArray.length <=
        this.databaseService.posts.length
      ) {
        this.scrollEvent = false;
      } else {
        this.databaseService.getFirstDoc(
        this.databaseService.posts.length, 'blog');
        this.scrollEvent = true;
        this.databaseService.preloader = true;
      }
    }
  }

  @HostListener('document:click', ['$event'])
	onClick(event: Event) {
    if(!this.shareButton.find((element: any) => event.target === element.nativeElement)) {
      this.databaseService.posts.forEach((item) => {
        item.shareButton = false
      })
    };
	};

  ngOnInit() {
    this.databaseService.preloader = true;
    this.databaseService.blog();
    this.headerMobileService.getRoute();
    this.databaseService.getUid()
    this.getUserData()
  }

  ngOnDestroy() {
    this.databaseService.posts = [];
    this.databaseService.responseArray = [];
    this.databaseService.snapshotSubscribe.unsubscribe();
    this.userSubscribe.unsubscribe();
  }

  commentsModal(post: object) {
    this.databaseService.getPostRef(post)
    this.databaseService.commentsModal = true;
  }

  getUserData() {
    this.userSubscribe = this.databaseService.getUser().subscribe((user: any) => {
      this.user = user
    });
  }

  shareButtonModal(post: any) {
    this.databaseService.posts.forEach((item) => {
      post === item ? item.shareButton = true : item.shareButton = false;
    })
    const baseURL = window.location.href.replace(this.router.url, '');
    const params = new HttpParams().set('id', post.id);
    this.shareUrl = `${baseURL}/post?${params.toString()}`;
  };

  openDescription(post: any, event: any){
    if(!this.descroptionTXT.find((element: any) => event.target === element.nativeElement)) {
      event.srcElement.parentElement.innerHTML = `${post.description}`
    }
  }
}
