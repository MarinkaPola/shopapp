import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription} from "rxjs";
import {UserService} from "../user.service";
import {OrderService} from "../order.service";
import {Good,  ServerResponse} from "../shared/interface";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit, OnDestroy {
    goods: Good[];
    bSub: Subscription;
  private subscription: Subscription;
  error: any;

    private response: any;
    sum: number;
    order_id: number;
    private subscription2: Subscription;
    private subscription3: Subscription;





  constructor(private userService: UserService,
              private http: HttpClient, private orderService: OrderService,
              private router: Router)
  {}

  ngOnInit(){

      this.subscription = this.orderService.getMessageUpdateCart().subscribe(data => { if (data.event === 'AddToCart') {
          this.getNewOrder();
      }});
      this.getNewOrder();

      this.subscription2 = this.orderService.getDelete().subscribe(data => { if (data.event === 'Delete') { console.log(data.event);
          this.getNewOrder();
      }});
      this.subscription3 = this.orderService.getDecrease().subscribe(data => { if (data.event === 'decrease') { console.log(data.event);
          this.getNewOrder();
      }});

  }

  ngOnDestroy() {
    if (this.bSub) {
      this.bSub.unsubscribe();
    }
  }

   getNewOrder() {
      this.bSub = this.userService.getBasket().subscribe((response:ServerResponse) => {
          console.log(response.data);
          this.goods= response.data;
          this.sum=0;
              for(let good of this.goods){
                  this.sum=this.sum+good.pivot.count*good.min_price;
                  this.order_id=good.pivot.order_id;
              }
              console.log(this.sum);
              this.orderService.changeSum(this.sum);
      },
          error => {
            this.error = error.message;
            console.log(error);
          },
      );
    };

    Increase(good: Good) {
        this.orderService.increase(good).subscribe(data => {
            this.response = data;

                this.sum=this.sum + good.min_price*1.00;
                this.orderService.changeSum(this.sum);
        },
        error => {
            this.error = error.message;
            console.log(error);
        });

    };


    Decrease(good: Good) {
        this.orderService.decrease(good).subscribe(data => {
            this.response = data;
                this.sum=this.sum - good.min_price*1.00;
                console.log(good.min_price*1.00);
                console.log(this.sum);
                this.orderService.changeSum(this.sum);
            },
            error => {
                this.error = error.message;
                console.log(error);
        });
        this.orderService.changeSum(this.sum);
        if(good.pivot.count == 1){this.orderService.DecreaseInCart();}
    }

    Delete(good: Good) {
        this.orderService.Delete(good).subscribe(data => {
                this.response = data;
            },
            error => {
                this.error = error.message;
                console.log(error);
            });
        this.orderService.DeleteInCart();
    }

    checkout() {
        this.router.navigate(['/order/',this.order_id]);
    }

    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }


}
