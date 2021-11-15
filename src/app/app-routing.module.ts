import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {MainLayoutComponent} from './shared/main-layout/main-layout.component';
import {AreaCategoryGoodsComponent} from "./area-category-goods/area-category-goods.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {AreaGoodsComponent} from "./area-goods/area-goods.component";
import {GoodComponent} from "./good/good.component";
import {BasketComponent} from "./basket/basket.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {OrderComponent} from "./order/order.component";
import {OrdersComponent} from "./orders/orders.component";




const routes: Routes = [
    {path: 'register', component: RegisterPageComponent},
    {path: 'login', component: LoginPageComponent},
  {

   path: '', component: MainLayoutComponent,
      children: [
          {path: '', redirectTo: '/', pathMatch: 'full'},
          {path: '', component: MainPageComponent},
          {path: 'order/:id', component:OrderComponent},
          {path: 'orders', component:OrdersComponent},
          {path: 'basket', component:BasketComponent},
          {path: 'area/:id', component: AreaGoodsComponent},
          {path: 'area/:id/category/:id', component: AreaCategoryGoodsComponent},
          {path: 'area/:id/category/:id/goods/:id', component:GoodComponent},

       ]
  },
   // {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
