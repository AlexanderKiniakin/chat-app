import { Component, HostListener} from '@angular/core';
import { AuthService } from './services/auth.service';
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'time-chat';

  constructor(private authService: AuthService, private firestore: AngularFirestore) {
    this.authService.getAuth();
  }

  @HostListener('window:beforeunload', ['$event'])
unloadHandler(event: Event) {
  this.firestore.doc(`users/${this.authService.userData.uid}`).update({online:false});
  return event;
}
}
