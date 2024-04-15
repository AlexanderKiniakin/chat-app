import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  public chatDocId: string;
  public addChatDescription: string = '';
  public inputIcon: boolean = false;
  public imageFile: string = '';

  constructor() {}

}