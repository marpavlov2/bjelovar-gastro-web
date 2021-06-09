import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RestaurantPageComponent } from './restaurant-page/restaurant-page.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { RegisterPageComponent } from './register-page/register-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'restaurant/:restaurantId', component: RestaurantPageComponent },
  { path: 'restaurant/:restaurantId/:productId', component: RestaurantPageComponent },
  { path: 'confirm-order/:producerId', component: ConfirmOrderComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }