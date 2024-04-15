import { 
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  ViewChild,
  QueryList,
  HostListener,
  } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { User } from '../interfaces/user';
import { take } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  trigger,
  style,
  animate,
  transition,
} from '@angular/animations';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-comments-blog',
  templateUrl: './comments-blog.component.html',
  styleUrls: ['./comments-blog.component.scss'],
  animations: [
    trigger('openModalComments', [
      transition(':enter', [
        style({ height: "0vh" }),
        animate('0.45s', style({ height: "75vh" })),
      ]),
    ]),
  ],
})
export class CommentsBlogComponent implements OnInit {

  private bodyDom: any = document.querySelector("body")
  public user: any;
  public commentText: string = "";
  public eventCounter: number;
  private lazyObjectsPosition: any[] = [];
  private scrollEvent: boolean = true;
  public commentDescription: string = '';
  private userSubscribe: any;

  constructor(
    public databaseService: DatabaseService,
    private firestore: AngularFirestore,
    public authService: AuthService,
    ) {}

  @ViewChildren('divRef') divRef: QueryList<ElementRef>;
  @ViewChild('divRefComments') divRefComments: ElementRef;
  @ViewChildren('deleteModal') deleteModal: QueryList<ElementRef>;

  onScroll() {
    let scrollElement = this.divRefComments.nativeElement.scrollTop;
    const elementHeight = this.divRefComments.nativeElement.offsetHeight;
    this.eventCounter = this.databaseService.comments.length - 1;
    if (this.scrollEvent) {
      this.lazyObjectsPosition = this.divRef.map((comment: ElementRef) => {
        return comment.nativeElement.offsetTop
      });
      this.scrollEvent = false;
    }
    if (
      scrollElement + elementHeight >=
        this.lazyObjectsPosition[this.eventCounter] ||
      this.databaseService.comments.length < 3
    ) {
      if (
        this.databaseService.responseCommentsArray.length <=
        this.databaseService.comments.length
      ) {
        this.scrollEvent = false;
      } else {
        this.databaseService.getCommentsFirstDoc(
          this.databaseService.comments.length
        );
        this.scrollEvent = true;
        this.databaseService.getCommentPreloader = true;
      }
    }
  }

  @HostListener('document:click', ['$event'])
	onClick(event: Event) {
    if(!this.deleteModal.find((element: any) => event.target === element.nativeElement)) {
      this.databaseService.comments.forEach((comment) => {
        comment.modal = false
      })
    };
	};

  ngOnInit() {
    this.bodyDom.style.overflow = "hidden";
    this.databaseService.preloaderComments = true;
    this.getUserData();
    this.databaseService.commentsSubscribe();
  }

  ngAfterViewInit() {
    this.divRefComments.nativeElement.style.height = "75vh";
  }

  ngOnDestroy() {
    this.bodyDom.style.overflow = "visible";
    this.databaseService.commentsSnapshotSubscribe.unsubscribe();
    this.databaseService.comments = [];
    this.databaseService.responseCommentsArray = [];
    this.userSubscribe.unsubscribe();
  }

  closeCommentsModal() {
    this.databaseService.visibleMenu = false;
    this.divRefComments.nativeElement.style.height = "0vh";
    setTimeout(() => {
      this.databaseService.commentsModal = false;
    }, 450);
  }

  getUserData() {
    this.userSubscribe = this.databaseService.getUser().subscribe((user: User) => {
        this.user = user;
      });
  }

  async addComment() {
    if (this.commentDescription.length >= 1){
      const collectionRef = this.firestore.collection('comments');
      const commentData = {
        date: new Date(),
        description: this.commentDescription,
        id: '',
        user: this.databaseService.userRef,
        post: this.databaseService.postRef,
        likes: 0
      }
      this.commentDescription = '';
      const docRef = await collectionRef.add(commentData)
      await collectionRef.doc(docRef.id).update({id: docRef.id});
    }
  }

  modal(comment: any) {
    const popover: any = document.querySelector('.comments-container_content-block__txt-del');
    if(!comment.modal) {
      this.databaseService.comments.forEach((element) => {
        element.id === comment.id ? comment.modal = true : element.modal = false
      })
    }else {
      popover.style.opacity = 0;
      popover.style.visibility = 'hidden';
      setTimeout(() => {
        comment.modal = false;
      }, 300);
    }
  }
}
