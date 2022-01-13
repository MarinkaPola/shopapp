import {Component,  OnDestroy, OnInit, VERSION} from '@angular/core';
import {DataResponse, Good, Meta,  ServerResponse} from "../shared/interface";
import {GoodService} from "../good.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";





@Component({
    selector: 'main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {
    name = 'Angular ' + VERSION.major;
    goods: Good[] = [];
    brand: string = '';
    brands: string[] = [];
    meta: Meta;
    iSub: Subscription;
    error: any;
    private subscription: Subscription;
    public search: string='';
    private subs: Subscription;
    i: number;
    query_param = {sortBy: 'rating', sortOrder: 'desc'};


    public queryParams: Params = {
        search: this.search,
        sortBy: this.query_param.sortBy,
        sortOrder: this.query_param.sortOrder,
        brand: this.brand,
        current_page: 1
    };

    private paramsSub: Subscription;

    constructor(private goodService: GoodService, private route: ActivatedRoute, private router: Router) {
         this.paramsSub = route.queryParamMap.subscribe(params => {
             this.queryParams.search=params.get('search');
             this.queryParams.sortBy=params.get('sortBy');
             this.queryParams.sortOrder=params.get('sortOrder');
             this.queryParams.brand=params.get('brand');
             this.queryParams.current_page=params.get('current_page');
             console.log(params);
             console.log(this.queryParams);
            if(this.queryParams.sortBy!==null&& this.queryParams.sortOrder!==null) {this.query_param={sortBy: this.queryParams.sortBy, sortOrder: this.queryParams.sortOrder};}
            if(this.queryParams.brand!==null) {this.brand=this.queryParams.brand}
             console.log(this.brand);
             console.log(this.query_param);
             this.getGoods(this.queryParams);
         });

    };

    ngOnInit() {
        this.subscription = this.goodService.getMessageUpdateGoods().subscribe(data => {
            if (data.event === 'changeSearch') {
                this.queryParams.current_page=1;
                this.getGoods(this.queryParams);
            }
        });

        this.getGoods(this.queryParams);
        this.getGoodsBrands();

    }


    ngOnDestroy() {
        if (this.iSub) {
            this.iSub.unsubscribe();
        }
    }

    getGoods(queryParams) {
        console.log(queryParams.search);
       this.subs = this.goodService.currentSearch.subscribe(search => this.search = search);
        console.log(this.queryParams.current_page);
        console.log(this.search);

        if(this.search=='' ||(this.search!==''&& this.queryParams.current_page>1)||
            this.brand=='' ||(this.brand!==''&& this.queryParams.current_page>1))
        {
           queryParams = {
                search: this.search,
                sortBy: this.query_param.sortBy,
                sortOrder: this.query_param.sortOrder,
                brand: this.brand,
                current_page: this.queryParams.current_page
            };}

        else if((this.search!==''&& this.queryParams.current_page=='')||(this.search!==''&& this.queryParams.current_page==1)
        ||(this.brand!==''&& this.queryParams.current_page=='')||(this.brand!==''&& this.queryParams.current_page==1)||
           ( this.search!==''&& this.brand!=='' &&this.queryParams.current_page==''))
        {
             queryParams= {
                search: this.search,
                sortBy: this.query_param.sortBy,
                sortOrder: this.query_param.sortOrder,
                brand: this.brand,
                current_page: 1
            };}

        this.router.navigate(['/main'],
            {
                queryParams:
                    {
                        sortBy: queryParams.sortBy,
                        sortOrder: queryParams.sortOrder,
                        brand: queryParams.brand,
                        search: queryParams.search,
                        current_page: queryParams.current_page
                    }
            });
        console.log(queryParams);

        this.iSub = this.goodService.getAll(queryParams).subscribe((data: DataResponse) => {
                this.goods = data.data.collection;
                this.meta = data.data.meta;
                console.log(data);
            },
            error => {
                this.error = error.message;
                console.log(error);
            }
        );
    }


    getGoodsBrands() {
        this.goodService.getBrands().subscribe((data: ServerResponse) => {
                this.brands = Object.values(data.data);
                console.log(data);
            },
            error => {
                this.error = error.message;
                console.log(error);
            },
        );
    }


    onChangeBrand(optionsValue: any) {
        this.queryParams.current_page =1;
        console.log(this.queryParams);
        this.getGoods(this.queryParams);
    }

    onChangeGoods(optionsValue: any) {
        this.getGoods(this.queryParams);
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2
            ? c1.sortBy === c2.sortBy && c1.sortOrder === c2.sortOrder
            : c1 === c2;
    }

    prevPage() {
        console.log(this.meta.current_page);
        if (this.meta.current_page > 1) {
            // this.router.navigate(['/main'], {queryParams: {current_page: this.meta.current_page - 1}});
             this.queryParams.current_page = this.meta.current_page - 1;
            this.getGoods(this.queryParams);
        }
    }

    nextPage() {
        console.log(this.meta.current_page);
        if (this.meta.current_page < this.meta.last_page) {
            // this.router.navigate(['/main'], {queryParams: {current_page: this.meta.current_page + 1}});
            this.queryParams.current_page = this.meta.current_page + 1;
            console.log(this.queryParams.current_page);
            this.getGoods(this.queryParams);
        }
    }


}
