import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Good, Review} from './shared/interface';
import {environment} from '../environments/environment';
import { map} from 'rxjs/operators';



@Injectable({providedIn: 'root'})
export class GoodService {
    err: string;
    public search = new BehaviorSubject('');
    currentSearch = this.search.asObservable();
    public subjBuy = new Subject<any>();

    constructor(private http: HttpClient) {
    }


    getAll(queryParam: any = {}) {
        console.log(queryParam);
        let queryString = new URLSearchParams(queryParam).toString();
        console.log(queryString);
        return this.http.get(`${environment.Url}/goods?${queryString}`)

    }

    getBrands() {
        return this.http.get(`${environment.Url}/index_brand`)
    }

    getById(id: number): Observable<Good> {
        console.log(id);
        return this.http.get<Good>(`${environment.Url}/goods/${id}`)
            .pipe(map((data) => { console.log(data);
                return (Object.keys(data).map(good=>({...data[good]})))[1]
            }));
    }


    createReview(review: Review, id: number) {
        if(review.id==null) {
            return this.http.post<Review>(`${environment.Url}/goods/${id}/reviews`, review)
                .pipe(map((data) => {
                    console.log(data);
                    return (Object.keys(data).map(review => ({...data[review]})))[1]
                }));
        } else {
            return this.http.put<Review>(`${environment.Url}/reviews/${review.id}`, review)
                .pipe(map((data) => {
                    console.log(data);
                    return (Object.keys(data).map(review => ({...data[review]})))[1]
                }));
        }
    }

    removeRe(review: Review){
        console.log(review);
        return this.http.delete<Review>(`${environment.Url}/reviews/${review.id}`);
    }

    updateReview(review: Review):Observable<Review> {
        return this.http.put<Review>(`${environment.Url}/reviews/${review.id}`, review)
            .pipe(map((data) => {
                return {
                    ...review,
                }
            }));
    }

    public  changeSearch(search:string){
        this.search.next(search);
        console.log(this.search);
    }

    getMessageUpdateGoods(): Observable<any> {
        return this.subjBuy.asObservable();
    }

    UpdateGoods() {
        this.subjBuy.next({event: 'changeSearch'});
        console.log({event: 'changeSearch'});
    }
}
