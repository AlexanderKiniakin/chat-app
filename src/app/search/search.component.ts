import { Component, OnInit } from '@angular/core';
import { HeaderMobileService } from '../services/header-mobile.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public qrData = 'https://github.com/Cordobo/angularx-qrcode';
  public showButtons = false;

  constructor(
    private headerMobileService: HeaderMobileService
    ) { }

  ngOnInit(): void {
    this.headerMobileService.getRoute()
  }

  ngOnDestroy(): void {
    this.showButtons = false;
  }

  showMenu() {
    this.showButtons = true;
  }

}
