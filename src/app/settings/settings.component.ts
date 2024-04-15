import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { DatabaseService } from '../services/database.service';
import { User } from '../interfaces/user';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
  constructor(public menuService: MenuService, private databaseService: DatabaseService) {}

  public user: User | null = null;
  private usersSubscribe: {} = {};


  ngOnInit() {
    this.databaseService.getUid();
    this.getAllUsers();
    
  }
  
   getAllUsers() {
    this.usersSubscribe = this.databaseService.getUser().subscribe((user) => {
      this.user = user;         
    })   
  }

}
