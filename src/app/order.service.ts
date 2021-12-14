import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Good, Order} from './shared/interface';
import {environment} from '../environments/environment';
import {map} from 'rxjs/operators';
import {AlertService} from "./alert.service";


@Injectable({providedIn: 'root'})
export class OrderService {
    public subjBuy = new Subject<any>();
    public sum = new BehaviorSubject(0);
    currentSum = this.sum.asObservable();
    private subjDelete = new Subject<any>();
    private subjDecrease = new Subject<any>();
    private subjIncrease= new Subject<any>();

    constructor(private http: HttpClient, private alert: AlertService) {
    }



    getAll(): Observable<Order[]> {
        return this.http.get<Order[]>(`${environment.Url}/order`)
            .pipe(map((data) => {
                return (Object.keys(data).map(orders => (data[orders])))[1]
            }))

    }

    getById(queryParam: any = {}): Observable<Order> {
        console.log(queryParam.order_id);
        return this.http.get<Order>(`${environment.Url}/order/${queryParam.order_id}`)
            .pipe(map((data) => {
                return (Object.keys(data).map(order=>({...data[order]})))[1]
            }));
    }

    getMessageUpdateCart(): Observable<any> {
        return this.subjBuy.asObservable();
    }

    UpdateCart() {
        this.subjBuy.next({event: 'AddToCart'});
    }

    AddToCart(good: Good, count: number) {

        let request = {
            good_id: good.id,
            count: count
        };
      console.log(request);
        return this.http.post(`${environment.Url}/good/in-basket`, request);
    }

      increase(good: Good) {
        let good_pivot_count = good.pivot.count + 1;
        if (good_pivot_count <= good.count) {
            good.pivot.count=good_pivot_count;
            console.log(good.pivot.count);
        } else {
            console.log(this.alert.danger);
            console.log(this.alert.danger('такого количества товара нет на складе'));
            this.alert.danger('такого количества товара нет на складе');
            //сообщение - такого количества товара нет на складе, алерт не работает как нужно
        }
        let request = {
            good_id: good.id,
            count: good.pivot.count
        };
        console.log(request);
        return this.http.post(`${environment.Url}/good/in-basket`, request);
    }

    IncreaseInCart(){
        this.subjIncrease.next({event: 'increase'});
    }
    getIncrease(): Observable<any> {
        return this.subjIncrease.asObservable();
    }


    decrease(good: Good) {

        if (good.pivot.count >= 2) {
            good.pivot.count=good.pivot.count-1;
        }
        let request = {
            good_id: good.id,
            count: good.pivot.count
        };
        console.log(request);
        return this.http.put(`${environment.Url}/good/out-basket`, request)
    }

    DecreaseInCart(){
        this.subjDecrease.next({event: 'decrease'});
    }
    getDecrease(): Observable<any> {
        return this.subjDecrease.asObservable();
    }

    getDelete(): Observable<any> {
        return this.subjDelete.asObservable();
    }
    DeleteInCart() {
        this.subjDelete.next({event: 'Delete'});
    }
    Delete(good: Good) {

        let request = {
            good_id: good.id,
            count: 0
        };
        console.log(request);
        return this.http.put(`${environment.Url}/good/out-basket`, request)
    }

    updateOrder(request: Order, order: Order){
         return this.http.put<Order>(`${environment.Url}/order/${order.id}`, request);}

    public changeSum(sum: number) {
        this.sum.next(sum);
        console.log(this.sum);
    }


}
