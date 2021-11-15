import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent }   from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {MainLayoutComponent} from "./shared/main-layout/main-layout.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainPageComponent } from './main-page/main-page.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { MenuComponent } from './shared/menu/menu.component';
import { AreaCategoryGoodsComponent } from './area-category-goods/area-category-goods.component';
import { AreaGoodsComponent } from './area-goods/area-goods.component';
import { GoodComponent } from './good/good.component';
import { BasketComponent } from './basket/basket.component';
import { LoginPageComponent } from './login-page/login-page.component';
import {RegisterPageComponent} from "./register-page/register-page.component";
import { UserAccountComponent } from './user-account/user-account.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpTokenInterceptor} from "./http.token.interceptor";
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';
import {registerLocaleData} from "@angular/common";
import ruLocale from '@angular/common/locales/ru';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AlertComponent} from "./alert/alert.component";
import {AlertService} from "./alert.service";
import {MatPaginatorModule} from '@angular/material/paginator';
import {AuthGuard} from "./auth-guard.service";
import {JwtService} from "./jwt.service";


registerLocaleData(ruLocale, 'ru');

@NgModule({
    declarations: [
        AppComponent,
        MainLayoutComponent,
        MainPageComponent,
        MenuComponent,
        AreaCategoryGoodsComponent,
        AreaGoodsComponent,
        GoodComponent,
        BasketComponent,
        LoginPageComponent,
        RegisterPageComponent,
        UserAccountComponent,
        OrderComponent,
        OrdersComponent,
        AlertComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        NgbModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
        }),
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true},
        AlertService,
        JwtService,
        AuthGuard,
    ],

    bootstrap:    [ AppComponent ]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
