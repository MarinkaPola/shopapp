import {Component, OnDestroy, OnInit} from '@angular/core';
import {Area} from "../interface";
import {MenuService} from "../../menu.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  areas: Area[] = [];
  iSub: Subscription;
  error: any;
  private paramForGoods: any;




  constructor(private menuService: MenuService) {
    this.paramForGoods={};
  }

  ngOnInit() {
    this.iSub = this.menuService.getAllAreasWithCategories().subscribe(areas => {
          this.areas = areas;
          console.log(areas);
        },
        error => {
          this.error = error.message;
          console.log(error);
        },
    );

  }


  ngOnDestroy() {
    if (this.iSub) {
      this.iSub.unsubscribe();
    }
  }

}
