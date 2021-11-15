import {Component,  OnDestroy, OnInit} from '@angular/core';
import {DataResponse, Good, Meta, QueryParam} from "../shared/interface";
import {GoodService} from "../good.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
    selector: 'main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {
    goods: Good[] = [];
    meta: Meta;
    iSub: Subscription;
    error: any;
    current_page = 1;
    private subscription: Subscription;
    queryParam: QueryParam;


    constructor(private goodService: GoodService, private ActivatedRoute: ActivatedRoute, private router: Router) {
        /*this.queryParam = {};
        this.subscription = ActivatedRoute.params.subscribe(() => {
            this.queryParam.current_page = this.current_page;
            console.log(this.queryParam.current_page);*/
        this.subscription = ActivatedRoute.queryParamMap.subscribe(params => {
            this.current_page = +params.get('current_page')||0;
            this.queryParam.current_page = this.current_page;
            console.log(ActivatedRoute.queryParamMap);
        })
    };

    ngOnInit() {
        this.iSub = this.goodService.getAll(this.queryParam).subscribe((data: DataResponse) => {
                this.goods = data.data.collection;
                this.meta = data.data.meta;
                console.log(data);
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

    nextPage(current_page) {
        console.log(current_page+1);
        this.router.navigate(['/'], { queryParams: { current_page: current_page +1} });

    }

    prevPage() {
        this.queryParam.current_page = this.queryParam.current_page - 1;
        console.log(this.queryParam.current_page);
        this.iSub = this.goodService.getAll(this.queryParam).subscribe((data: DataResponse) => {
                this.goods = data.data.collection;
                this.meta = data.data.meta;
                console.log(data);
            },
            error => {
                this.error = error.message;
                console.log(error);
            },
        );
    }

}
