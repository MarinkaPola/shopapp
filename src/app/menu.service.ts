import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Area} from './shared/interface';
import {environment} from '../environments/environment';
import {map} from 'rxjs/operators';




@Injectable({providedIn: 'root'})
export class MenuService {
    err: string;


    constructor(private http: HttpClient) {
    }

    getAllAreasWithCategories(): Observable<Area[]> {
        return this.http.get<Area[]>(`${environment.Url}/area`)
            .pipe(map((data) => {
                return (Object.keys(data).map(areas=>data[areas]))[0]
            }))
    }



}
