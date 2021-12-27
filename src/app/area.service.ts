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



    getById(queryParam: any={}): Observable<Area> {
      console.log(queryParam.area_id);
        return this.http.get<Area>(`${environment.Url}/area/${queryParam.area_id}`)
            .pipe(map((data) => {
                return (Object.keys(data).map(area=>({...data[area]})))[1]
            }));

    }

}
