import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit, OnDestroy {
  public settingDesktop = true;
  
  constructor(public menuService: MenuService) {}
  
  showSetting() {
    this.settingDesktop = !this.settingDesktop;
  }
  ngOnInit(): void {
    this.menuService.relayComponent = false;
    this.menuService.changeIcon = true;
    this.menuService.showMessage = false;
  }
  ngOnDestroy() {
    this.menuService.changeIcon = false;
    this.menuService.relayComponent = true;
  }
}
