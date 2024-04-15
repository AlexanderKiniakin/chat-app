import { 
  Component, 
  OnInit, 
  HostListener, 
  ElementRef, 
  ViewChildren, 
  QueryList 
} from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { HttpParams } from "@angular/common/http";

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss']
})
export class MyPostsComponent implements OnInit{

  public eventCounter = 2;
  private windowHeight: number = document.documentElement.clientHeight;
  private lazyObjectsPosition: any [] = [];
  private scrollEvent = true;
  public shareUrl: string;

  constructor(
    public databaseService: DatabaseService,
    public mainService: MainService,
    private router: Router,
    ) {}

  @ViewChildren('divRef') divRef: QueryList<ElementRef>;
  @ViewChildren('divRefMyPosts') divRefMyPosts: QueryList<ElementRef>;
  @ViewChildren('shareButton') shareButton: QueryList<ElementRef>;
  @ViewChildren('descroptionTXT') descroptionTXT: QueryList<ElementRef>;
  
  @HostListener('window:scroll', []) 
  onScrollEvent(){    
    this.eventCounter = this.databaseService.posts.length - 1
    if(this.scrollEvent) {
      this.lazyObjectsPosition = this.divRef.map((post: ElementRef) => {
        return post.nativeElement.offsetTop
      })
      this.scrollEvent = false;
    }
    if(scrollY + this.windowHeight >= this.lazyObjectsPosition[this.eventCounter] || 
      this.databaseService.posts.length < 3) {
      if(this.databaseService.responseArray.length === this.databaseService.posts.length) {
        this.scrollEvent = false;
      } else {
        this.databaseService.getFirstDoc(this.databaseService.posts.length, 'userBlog');
        this.scrollEvent = true;
        this.databaseService.preloader = true;
      }
    }
  }

  @HostListener('document:click', ['$event'])
	onClick(event: Event) {
    if(!this.divRefMyPosts.find((element: any) => event.target === element.nativeElement)) {
      this.databaseService.posts.forEach((post) => {
        post.modal = false
      })
    };
    if(!this.shareButton.find((element: any) => event.target === element.nativeElement)) {
      this.databaseService.posts.forEach((item) => {
        item.shareButton = false
      })
    };
	};
    
  ngOnInit() {
    this.databaseService.preloader = true;
    this.databaseService.getUid();
    this.databaseService.userBlog();
  }

  ngOnDestroy() {
    this.databaseService.posts = [];
    this.databaseService.responseArray = [];
    this.databaseService.snapshotSubscribe.unsubscribe();
  }

  modal(post: any) {
    const popover: any = document.querySelector('.my-posts-container_posts-block_user-block__txt-del');
    if(!post.modal) {
      this.databaseService.posts.forEach((element) => {
        element.id === post.id ? post.modal = true : element.modal = false
      })
    }else {
      popover.style.opacity = 0;
      popover.style.visibility = 'hidden';
      setTimeout(() => {
        post.modal = false;
      }, 300);
    }
  }

  commentsModal(post: object) {
    this.databaseService.getPostRef(post)
    this.databaseService.commentsModal = true;
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
