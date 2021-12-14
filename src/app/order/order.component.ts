import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../order.service";
import {Subscription} from "rxjs";
import {Order, QueryParam, User} from "../shared/interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user.service";


@Component({
    selector: 'order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

    order: Order;
    id: number;
    private subscription: Subscription;
    queryParam: QueryParam;
    private iSub: Subscription;
    private error: any;
    private subs: Subscription;
    public sum: number;
    form: FormGroup;
    payment: string;
    info:string;
    delivery: string;
    submitted = false;
    private sub_o: Subscription;
    private userSub: Subscription;
    user: User;

    constructor(private orderService: OrderService, private userService: UserService, private http: HttpClient,
                private router: Router, private route: ActivatedRoute) {
        this.queryParam = {};
        this.subscription = route.params.subscribe(params => this.queryParam.order_id = params['id']);
        console.log(this.queryParam);
    }

    ngOnInit() {

        this.iSub = this.orderService.getById(this.queryParam).subscribe(order => {
                this.order = order;
                console.log(this.order);
                console.log(this.order.buyer_id);
                this.userSub=this.userService.getById(this.order.buyer_id).subscribe(data=>{
                    this.user = data;
                    console.log(this.user);
                });

            },

            error => {
                this.error = error.message;
                console.log(error);
            },
        );
        this.subs = this.orderService.currentSum.subscribe(sum => this.sum = sum);
        console.log(this.sum);

        /* this.userSub=this.userService.getById(this.order.buyer_id).subscribe(user=>{
             this.user = user;
             console.log(this.user);
         });*/


        this.form = new FormGroup({
            delivery: new FormControl(null),
            payment: new FormControl(null),
            info: new FormControl(null)
        });

    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }


    submit() {
        this.submitted = true;
        let request = {
            delivery: this.form.value.delivery,
            payment: this.form.value.payment,
            info: this.form.value.info
        };
        console.log(request);

        this.sub_o = this.orderService.updateOrder(request, this.order).subscribe(order => {
            this.order = order;
            console.log(this.order);
        });
        setTimeout(()=>{ this.router.navigate(['/orders'])}, 2000);

    }
}
