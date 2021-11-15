import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Area} from './shared/interface';
import {environment} from '../environments/environment';
import { map} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class AreaService {
    err: string;



    constructor(private http: HttpClient) {}

    /*getAll(queryParam: any={}): Observable<Area[]> {
      let  queryString=new URLSearchParams(queryParam).toString();
      console.log(queryString);
        return this.http.get<Area[]>(`${environment.Url}/area?${queryString}`)
            .pipe(map((data)=>{
                return (Object.keys(data).map(goods=>({...data[goods]})))[1].collection
                }))


    }*/

    getById(queryParam: any={}): Observable<Area> {
        let  queryString=new URLSearchParams(queryParam).toString();
        return this.http.get<Area>(`${environment}/area?${queryString}`)
            .pipe(map((area: Area) => {
                return {
                    ...area

                };

            }));
    }

}
