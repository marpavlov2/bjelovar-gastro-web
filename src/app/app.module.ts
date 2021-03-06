import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RoutingModule } from './routing.module';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './services/auth.service';
import { MasterDataService } from './services/master-data.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RestaurantPageComponent } from './restaurant-page/restaurant-page.component';
import { FoodExtrasDialogComponent } from './food-extras-dialog/food-extras-dialog.component';
import { ProductNoteDialogComponent } from './product-note-dialog/product-note-dialog.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { RegisterPageComponent } from './register-page/register-page.component';
 
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    RestaurantPageComponent,
    ProductNoteDialogComponent,
    FoodExtrasDialogComponent,
    ConfirmOrderComponent,
    RegisterPageComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    SwiperModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [    
    MasterDataService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
    provide: SWIPER_CONFIG,
    useValue: DEFAULT_SWIPER_CONFIG
  }],
  entryComponents: [
    ProductNoteDialogComponent,
    FoodExtrasDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
