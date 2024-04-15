import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatListComponent } from './chat-list/chat-list.component';
import { StartPageComponent } from './start-page/start-page.component';
import { VerificationComponent } from './verification/verification.component';
import { MessageComponent } from "./message/message.component";
import { RegistrationComponent } from "./registration/registration.component";
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { BlogComponent } from './blog/blog.component';
import { SettingsComponent } from './settings/settings.component';
import { PostCreatingComponent } from './post-creating/post-creating.component';
import { ProfileSettingDesktopComponent } from './profile-setting-desktop/profile-setting-desktop.component';
import { DesktopComponent } from './desktop/desktop.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { PostLinkComponent } from './post-link/post-link.component';

const routes: Routes = [
  { path: '', component: StartPageComponent},
  { path: 'verification', component: VerificationComponent,},
  { path: 'message', component: MessageComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'profile', component: ProfileComponent}, 
  { path: 'chat-list', component: ChatListComponent}, 
  { path: 'search', component: SearchComponent},
  { path: 'blog', component: BlogComponent},
  { path: 'settings', component: SettingsComponent},
  { path: 'add-post', component: PostCreatingComponent },
  { path: 'profile-setting-desktop', component: ProfileSettingDesktopComponent},
  { path: 'my-posts', component:MyPostsComponent},
  { path: 'desktop', component: DesktopComponent,
    children: [
      { path: 'profile-setting-desktop', component: ProfileSettingDesktopComponent},
      { path: 'chat-list', component: ChatListComponent },
    ]
  },
  { path: 'post', component: PostLinkComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }
