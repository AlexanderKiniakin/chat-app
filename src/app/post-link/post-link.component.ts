import { 
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderMobileService } from '../services/header-mobile.service';
import { MainService } from '../services/main.service';
import {HttpParams} from "@angular/common/http";
import { take } from 'rxjs';

@Component({
  selector: 'app-post-link',
  templateUrl: './post-link.component.html',
  styleUrls: ['./post-link.component.scss']
})
export class PostLinkComponent implements OnInit {

  likeClicked = false;
  
  public params: any;
  public shareUrl: string
  public user: any;
  public postLiked = false;
  private userSubscribe: any;

  constructor(
    public databaseService: DatabaseService,
    private headerMobileService: HeaderMobileService,
    public authService: AuthService,
    private router: Router,
    public mainService: MainService,
    private activatedRoute: ActivatedRoute
    ){}

    @ViewChildren('shareButton') shareButton: QueryList<ElementRef>;
    @ViewChildren('descroptionTXT') descroptionTXT: QueryList<ElementRef>;

    @HostListener('document:click', ['$event'])
    onClick(event: Event) {
      if(!this.shareButton.find((element: any) => event.target === element.nativeElement)) {
        this.databaseService.posts.forEach((item) => {
          item.shareButton = false
        })
      };
    };

  ngOnInit() {
    this.databaseService.getUid()
    this.getUserData()
    this.databaseService.preloader = true;
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((param: any) => this.params = param);
    this.databaseService.getOnePost(this.params.id);
    this.headerMobileService.getRoute();
  }

  ngOnDestroy() {
    this.databaseService.posts = [];
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
