import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  public showDesktopChat = false;
  public showCalls = false;
  public showCount = false;

  constructor() { }
}

