import {Component, OnDestroy, OnInit, VERSION} from '@angular/core';
import {Category, DataResponse, Good, Meta, QueryParam, ServerResponse} from "../shared/interface";
import {Subscription} from "rxjs";
import {GoodService} from "../good.service";
import {ActivatedRoute, Params, PRIMARY_OUTLET, Router} from "@angular/router";
import {NgModel} from "@angular/forms";
import {CategoryService} from "../category.service";


@Component({
    selector: 'area-category-goods',
    templateUrl: './area-category-goods.component.html',
    styleUrls: ['./area-category-goods.component.css']
})
export class AreaCategoryGoodsComponent implements OnInit, OnDestroy {
    name = 'Angular ' + VERSION.major;
    goods: Good[] = [];
    brand: string = '';
    brands: string[] = [];
    iSub: Subscription;
    private subscription: Subscription;
    error: any;
    queryParam: QueryParam;
    private subscription1: Subscription;
    meta: Meta;
    i: number;
    public search: string='';
    query_param={ sortBy: 'rating', sortOrder: 'desc' };
    private subs: Subscription;
    category: Category;
    private categorySub: Subscription;

    public queryParams: Params = {
        search: this.search,
        sortBy: this.query_param.sortBy,
        sortOrder: this.query_param.sortOrder,
        brand: this.brand,
        current_page: 1
    };


    constructor(private goodService: GoodService, private route: ActivatedRoute,
                private router: Router, private categoryService: CategoryService) {
        this.queryParam = {};
        this.subscription = route.params.subscribe(params => { this.queryParam.category_id=params['id'];
        console.log(params);
        /*this.subscription1 = route.queryParamMap.subscribe(params => {
            this.current_page = +params.get('current_page') || 0;
            this.queryParam.current_page = this.current_page;
            console.log(route.queryParamMap);
        });*/
        this.getNewGoods(this.queryParams);
        });
    }


    ngOnInit() {
        this.subscription = this.goodService.getMessageUpdateGoods().subscribe(data => {
            if (data.event === 'changeSearch') {
                this.queryParams.current_page=1;
                this.getNewGoods(this.queryParams);
            }
        });
        this.getNewGoods(this.queryParams);
        this.getGoodsBrands();
    }

    ngOnDestroy() {
        if (this.iSub) {
            this.iSub.unsubscribe();
        }
    }

    getNewGoods(queryParams) {
        this.subs = this.goodService.currentSearch.subscribe(search => this.search = search);
        console.log(this.search);

        if(this.search=='' ||(this.search!==''&& this.queryParams.current_page>1)||
            this.brand=='' ||(this.brand!==''&& this.queryParams.current_page>1))
        {
         queryParams = {
            search: this.search,
            sortBy: this.query_param.sortBy,
            sortOrder: this.query_param.sortOrder,
            brand: this.brand,
             current_page: this.queryParams.current_page,
            area_id: this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments[2].path.toString(),
            category_id: this.queryParam.category_id,
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
                area_id: this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments[2].path.toString(),
                category_id: this.queryParam.category_id,
                current_page: 1
            };}
        console.log(this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments[2].path.toString());
        this.router.navigate(['main/area/',this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments[2].path.toString(),
                  'category',this.route.snapshot.params.id],
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

        this.iSub = this.goodService.getAll(queryParams).subscribe((data: DataResponse) => {
                this.goods = data.data.collection;
                this.meta = data.data.meta;
                console.log(this.goods);
                console.log(this.meta);
            },

            error => {
                this.error = error.message;
                console.log(error);
            },);

        this.categorySub= this.categoryService.getById(this.queryParam).subscribe(category => {
                this.category = category;
                console.log(category);
            },
            error => {
                this.error = error.message;
                console.log(error);
            },
        )
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
        this.getNewGoods(this.queryParams);
    }

    onChangeGoods(optionsValue: any) {
        this.getNewGoods(this.queryParams);
    }
    compareFn(c1: any, c2: any): boolean {
        return c1 && c2
            ? c1.sortBy === c2.sortBy && c1.sortOrder === c2.sortOrder
            : c1 === c2;
    }

    prevPage() {
        console.log(this.meta.current_page);
        if (this.meta.current_page > 1) {
          //  this.router.navigate(['area/',this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments[1].path.toString(),
          //       'category',this.route.snapshot.params.id], {queryParams: {current_page: this.meta.current_page - 1}});
            this.queryParams.current_page = this.meta.current_page - 1;
            this.getNewGoods(this.queryParams);
        }
    }

    nextPage() {
        console.log(this.meta.current_page);
        if (this.meta.current_page < this.meta.last_page) {
          //  this.router.navigate(['area/',this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments[1].path.toString(),
          //      'category',this.route.snapshot.params.id ], {queryParams: {current_page: this.meta.current_page + 1}});
            this.queryParams.current_page = this.meta.current_page + 1;
            this.getNewGoods(this.queryParams);
        }
    }
}
