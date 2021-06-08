import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SwiperComponent, SwiperDirective } from "ngx-swiper-wrapper";
import { SwiperOptions } from "swiper";
import { User } from "../interfaces/user.interface";
import * as moment from "moment";
import { MasterDataService } from "../services/master-data.service";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
})
export class HomePageComponent implements OnInit {
  user: User;
  restaurants: Array<any> = [];
  mostOrderedProducts: Array<any> = [];
  topOfferProducts: Array<any> = [];
  
  public swiperConfig: SwiperOptions = {
    direction: "horizontal",
    slidesPerView: 'auto',
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    pagination: false,
    spaceBetween: 15,
    loop: true,
  };

  @ViewChild(SwiperComponent, { static: false }) componentRef?: SwiperComponent;
  @ViewChild(SwiperDirective, { static: false }) directiveRef?: SwiperDirective;
  
  constructor(private router: Router, public md: MasterDataService, public auth: AuthService) {}
  
  public async ngOnInit(): Promise<void> {
    this.md.userProductsList = [];
    this.user = this.auth.user;
    this.topOfferProducts = await this.md.getTopOfferProducts() as any;
    this.mostOrderedProducts = await this.md.getMostOrderedProducts() as any;
    this.getRestorants();
  }

  async getRestorants() {
    this.restaurants = await this.md.getProducers() as any;
    this.restaurants.forEach((restaurant) => {
      if (restaurant.deliveryDays) {
        for (const property in restaurant.deliveryDays) {
          var format = 'hh:mm:ss';
          let start = restaurant.deliveryDays[property].split('-')[0]; 
          let end = restaurant.deliveryDays[property].split('-')[1]; 
          let currentTime = moment();
          let day = currentTime.format('dddd').toLowerCase();
    
          if (property === day) {
            let time = moment(currentTime, format);
            let beforeTime = moment(start, format);
            let afterTime = moment(end, format);
            if (time.isBetween(beforeTime, afterTime)) {
              restaurant.isWorking = true;
            } else {
              restaurant.isWorking = false;
            }
          }
        }
        }
    });
    this.restaurants.sort(function(x, y) {
      // true values first
      return (x.isWorking === y.isWorking)? 0 : x.isWorking? -1 : 1;
      // false values first
      // return (x === y)? 0 : x? 1 : -1;
  });
  }

  goToLogin() {
    console.log('login')
    this.router.navigate([`/login`]);
  }

  navigateToProfile() {
    this.router.navigate[(`/home/profile`)];
  }

  async goToRestaurantPage(producerId: string, productId?: string) {
    this.md.userProductsList = [];
    this.md.producerProducts = [];
    this.md.producer = await this.md.getProducer(producerId);
    if (productId) {
      this.router.navigate([`/restaurant/${producerId}/${productId}`]);
    } else {
      this.router.navigate([`/restaurant/${producerId}`]);
    }
  }
}
