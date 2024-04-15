import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderMobileService {
  public dynamic = false;
  public mainHeader = false;
  public searchActive = false;
  public activeRouteComponent: any;
  private params: any;
  public searchActiveDesktop = false;
  public settingPageOption = [
    {
      name: 'TimeChat',
      path: '/chat-list',
      line: false,
    },
    {
      name: 'TimeChat',
      path: '/blog',
      line: false,
    },
    {
      name: 'TimeChat',
      path: '/post',
      line: false,
    },
    {
      name: 'Settings',
      path: '/search',
      line: true,
    },
    {
      name: 'Profile',
      path: '/profile',
      line: true,
    },
  ];

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute
    ) {}

  getRoute() {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((param: any) => this.params = param);
    const router = this.route.routerState.snapshot.url.replace(`?id=${this.params.id}`, '')
    if (
      this.route.routerState.snapshot.url === '/chat-list' ||
      this.route.routerState.snapshot.url === '/search' ||
      this.route.routerState.snapshot.url === '/profile' ||
      this.route.routerState.snapshot.url === '/blog' ||
      router === '/post'
    ) {
      this.mainHeader = true;
    }


    this.settingPageOption.find((item) => {
      if (this.route.routerState.snapshot.url === item.path ||
        router === item.path
        ) {
        this.activeRouteComponent = item;
      }
    });

    if (
      this.route.routerState.snapshot.url === '/search' ||
      this.route.routerState.snapshot.url === '/profile'
    ) {
      this.dynamic = true;
    } else {
      this.dynamic = false;
    }
  }
}
