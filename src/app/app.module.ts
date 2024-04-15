import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { SearchComponent } from './search/search.component';
import { ProfileSettingDesktopComponent } from './profile-setting-desktop/profile-setting-desktop.component';
import { BlogComponent } from './blog/blog.component';
import { SettingsComponent } from './settings/settings.component';
import { QRCodeModule }  from 'angularx-qrcode';
import { ChatListComponent } from './chat-list/chat-list.component';
import { MenuComponent } from './menu/menu.component';
import { StartPageComponent } from './start-page/start-page.component';
import { VerificationComponent } from './verification/verification.component';
import { RegistrationComponent} from "./registration/registration.component";
import { MessageComponent } from "./message/message.component";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule} from 'ng-lazyload-image';
import { AvatarPipe } from './pipes/avatar.pipe';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { PostCreatingComponent } from './post-creating/post-creating.component';
import { DesktopComponent } from './desktop/desktop.component';
import { SearchPipe } from './pipes/search.pipe';
import { LikePipe } from './pipes/like.pipe';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { CommentsBlogComponent } from './comments-blog/comments-blog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AutosizeModule} from 'ngx-autosize';
import { PostLinkComponent } from './post-link/post-link.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatListComponent,
    MenuComponent,
    StartPageComponent,
    VerificationComponent,
    RegistrationComponent,
    MessageComponent,
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    ProfileComponent,
    ProfileSettingDesktopComponent,
    BlogComponent,
    SettingsComponent,
    DateAgoPipe,
    AvatarPipe,
    PostCreatingComponent,
    DesktopComponent,
    SearchPipe,
    MyPostsComponent,
    CommentsBlogComponent,    
    LikePipe, 
    PostLinkComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    AngularFirestoreModule,
    QRCodeModule,
    BrowserAnimationsModule,
    AngularFireAuthModule,
    FormsModule,
    LazyLoadImageModule,
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ShareIconsModule,
    AutosizeModule,
  ],
  providers:  [],
  bootstrap: [AppComponent]
})
export class AppModule { }
