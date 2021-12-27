import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Category} from './shared/interface';
import {environment} from '../environments/environment';
import { map} from 'rxjs/operators';
import {PRIMARY_OUTLET, Router} from "@angular/router";


@Injectable({providedIn: 'root'})
export class CategoryService {
    err: string;



    constructor(private http: HttpClient, private router: Router) {}



    getById(queryParam: any={}): Observable<Category> {
        return this.http.get<Category>(`${environment.Url}/category/${queryParam.category_id}`)
            .pipe(map((data) => { console.log(data);
                return (Object.keys(data).map(category=>({...data[category]})))[1]
            }));

    }

}
