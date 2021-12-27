import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserAuth} from "../interface";
import {UserService} from "../../user.service";
import {GoodService} from "../../good.service";


@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
    user: UserAuth;
    search: string = '';


    constructor(private userService: UserService, private goodService: GoodService,
                private router: Router) {

    }

    ngOnInit() {
    }

    checkAuth() {
        if (localStorage.getItem('user-token') !== null) {
            return true;
        }
        return false;
    }


    logout(event: Event) {
        event.preventDefault();
        this.userService.logout();
        this.router.navigate(['']);
    }

    SearchGood(search) {
        this.search = search;
        console.log(this.search);
        this.goodService.changeSearch(this.search);
        this.goodService.UpdateGoods();
    }

    onSearchChange() {
        if (this.search == '') {
            console.log(this.search);
            this.goodService.changeSearch(this.search);
            this.goodService.UpdateGoods();
        }
    }
}
