import { HeaderMobileService } from '../services/header-mobile.service';
import { MenuService } from '../services/menu.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public userParams: string;
  public user: User | null = null;
  private paramsSubscription: Subscription;
  private userSubscription: Subscription;

  isExpanded = false;
  state = 'initial';

  expand() {
    this.isExpanded = !this.isExpanded;
    this.state = this.isExpanded
      ? 'expanded'
      : 'initial';
    console.log(this.state)
  }

  constructor(
    public headerMobileService: HeaderMobileService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.expand()
    this.paramsSubscription = this.route.queryParams.subscribe(
      (params: any) => {
        this.userParams = params['user'];
        this.getUser(this.userParams);
      }
    );
  }

  ngOnDestroy(): void {
    this.expand()
    this.paramsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  getUser(uid: string) {
    this.userSubscription = this.authService
      .getUser(uid)
      .subscribe((user: any) => (this.user = user));
  }
}
