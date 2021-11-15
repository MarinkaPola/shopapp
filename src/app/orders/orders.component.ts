import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderService} from "../order.service";
import {Observable, Subscription} from "rxjs";
import {Order} from "../shared/interface";

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private oSub: Subscription;
  orders: Order[] = [];
  error: any;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.oSub = this.orderService.getAll().subscribe(orders => {
          this.orders = orders;
          console.log(this.orders);

        },

        error => {
          this.error = error.message;
          console.log(error);
        },
    );
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }


}
