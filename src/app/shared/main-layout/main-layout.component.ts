import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserAuth} from "../interface";
import {UserService} from "../../user.service";


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
   user:UserAuth;

  constructor(private userService: UserService, private router: Router) {

  }

  ngOnInit() {
  }
    checkAuth(){
        if(localStorage.getItem('user-token')!==null){
            return true;
        }
        return false;
    }


    logout(event: Event) {
        event.preventDefault();
        this.userService.logout();
        this.router.navigate(['']);
    }
}
