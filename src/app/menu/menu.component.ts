import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(public menuService: MenuService) { }

  toggle(id: any) {
    this.menuService.menuItem.forEach((item) => {
      item.active = false;
    })
    this.menuService.menuItem[id].active = true;
    
}
  ngOnInit(): void {
    
  }
}
