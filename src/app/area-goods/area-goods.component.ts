import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataResponse, Good, Meta, QueryParam} from "../shared/interface";
import {Subscription} from "rxjs";
import {GoodService} from "../good.service";
import {ActivatedRoute, Router} from "@angular/router";





@Component({
  selector: 'area-goods',
  templateUrl: './area-goods.component.html',
  styleUrls: ['./area-goods.component.css']
})
export class AreaGoodsComponent implements OnInit, OnDestroy{

  goods: Good[] = [];
  iSub: Subscription;
  private subscription: Subscription;
  error: any;
  queryParam: QueryParam;
  private subscription1: Subscription;
  current_page = 1;
  meta: Meta;


  constructor(private goodService: GoodService, private route: ActivatedRoute, private router: Router) {
    this.queryParam={};
    this.subscription = route.params.subscribe(params=>{this.queryParam.area_id=params['id']; console.log(params);
      console.log(route.params);
      this.subscription1 = route.queryParamMap.subscribe(params => {
        this.current_page = +params.get('current_page')||0;
        this.queryParam.current_page = this.current_page;
        console.log(route.queryParamMap);
      });
    this.getNewGoods();});

  }

  ngOnInit() {

  }


  ngOnDestroy() {
    if (this.iSub) {
      this.iSub.unsubscribe();
    }
  }

getNewGoods(){
   console.log(this.queryParam.current_page);
  this.iSub = this.goodService.getAll(this.queryParam).subscribe((data:DataResponse) => {
        this.goods = data.data.collection;
        this.meta = data.data.meta;
        console.log(this.goods);
        console.log(this.meta );
      },

      error => {
        this.error = error.message;
        console.log(error);
      },
  );
}

  prevPage() {
    console.log(this.meta.current_page);
    if (this.meta.current_page>1) {
    this.router.navigate([], {queryParams: {current_page: this.meta.current_page - 1}});
    this.queryParam.current_page = this.meta.current_page - 1;
    this.getNewGoods();
  }
  }
  nextPage() {
    console.log(this.meta.current_page);
    if (this.meta.current_page<this.meta.last_page) {
      this.router.navigate([], {queryParams: {current_page: this.meta.current_page + 1}});
      this.queryParam.current_page = this.meta.current_page + 1;
      this.getNewGoods();
    }
  }
}
