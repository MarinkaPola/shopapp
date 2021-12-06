import {User, UserResponseModel} from "./shared/interface";
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';

import {map} from 'rxjs/operators';
import {environment} from "../environments/environment";
import {ServerResponse} from "./shared/interface";

import {Router} from "@angular/router";
import {JwtService} from "./jwt.service";


@Injectable({providedIn: 'root'})
export class UserService {

    storage: any = window.localStorage;
    readonly KEY: string = 'user-role';
    private response: ServerResponse;
    user: User;

    private currentUserSubject = new BehaviorSubject<User>({} as User);
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    // public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
    // public isAuthenticated = this.isAuthenticatedSubject.asObservable().pipe(distinctUntilChanged());


    constructor(
        private http: HttpClient,
        private jwtService: JwtService,
        private router: Router,
    ) {
    }


    isAuth(): boolean {
        return !!this.jwtService.token;
    }

    setAuth(user: User, token?: string) {
        console.log(user);
        // Save JWT sent from server in localstorage
        if (token) {
            this.jwtService.setToken(token);

        } else {
            this.jwtService.setToken(user.api_token);
        }
        // Set role
        this.storage.setItem(this.KEY, user.role);
        // Set current user data into observable
        this.currentUserSubject.next(user);
        console.log(user);
        // Set isAuthenticated to true
        this.isAuthenticatedSubject.next(true);

    }

    purgeAuth() {
        // Remove JWT from localstorage
        this.jwtService.destroyToken();
        // Set current user to an empty object
        this.currentUserSubject.next({} as User);
        // Set auth status to false
        this.isAuthenticatedSubject.next(false);
    }

    /*
        // Update the user on the server (email, pass, etc)
        update(user): Observable<User> {
            return this.http.put(`${environment.Url}/user`, user)
                .pipe(map((response: ServerResponse) => {
                    // Update the currentUser observable
                    this.currentUserSubject.next(response.data);
                    return response.data;
                }));
        }*/

    getById(id: number): Observable<any> {
        console.log(id);
        return this.http.get<any>(`${environment.Url}/user/${id}`)
            .pipe(map((response: ServerResponse) => {
                return response.data
            }));
    }

    login(user) {
        console.log(user);
        this.http.post(`${environment.Url}/login`, user).subscribe((res: UserResponseModel) => {
                if (res.success) {
                    this.setAuth(res.data);
                    this.router.navigate([`/`]);
                } else {
                    this.router.navigate([`register`]);
                }
            }
        )
    }

    getBasket() {
        return this.http.get(`${environment.Url}/user/basket-now`)
    }

    logout() {
        if (this.isAuth()) {
            this.http.post(`${environment.Url}/logout`, '').subscribe(res => {
                if (res) {
                    this.purgeAuth(); // стирание куки и стримов
                    this.router.navigate(['/']); // редирект на главную
                }

            });
        }
        this.purgeAuth(); // стирание куки и стримов
        this.router.navigate(['/']); // редирект на главную
    }

    /*getUser(): User {
        return this.currentUserSubject.value;
    }*/

    register(user: User) {
        console.log(user);
        this.http.post(`${environment.Url}/register`, user).subscribe((res: UserResponseModel) => {
            if (res.success) {
                this.setAuth(res.data);
                this.router.navigate([`/`]);
            } else {
                this.router.navigate([`register`]);
            }
        })
    }







}
