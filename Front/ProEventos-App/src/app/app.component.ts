import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { User } from './models/identity/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(public accountService: AccountService) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    if(localStorage.getItem('user')){
      this.accountService.setCurrentUser(JSON.parse(localStorage.getItem('user') ?? '{}'));
    }
  }
}
