import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { MasterDataService } from '../services/master-data.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit {
  @ViewChild('searchInput', {static: false}) searchInput: any;
  address:string;
  
  lat: string;
  long: string;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  deliveryNumber: number;
  telephoneNumber: string;
  order: any;
  note: string = '';
  deliveryAddress: string;
  pickupType = "RESTAURANT_DELIVERY";

  private subscriptions: Subscription;
  user: User;

  get totalPrice() {
    if (this.order && this.order.products) {
      let total: number = 0;
      for (let i = 0; i < this.order.products.length; i++) {
        const product = this.order.products[i];
        if (product.discount) {
          total += product.discountDisplayPrice * product.orderQuantity;
        } else {
          total += product.displayPrice * product.orderQuantity;
        }
        if (product.foodExtras) {
          product.foodExtras.forEach(foodExtra => {
            total += foodExtra.displayPrice * foodExtra.quantity;
          });
        }
      }
      if (this.order.deliveryPrice && this.pickupType === 'RESTAURANT_DELIVERY') {
        total += this.order.deliveryPrice
      }
      return total;
    }
  }

  constructor(
    public md: MasterDataService,
    private router: Router,
    private route: ActivatedRoute,
    /* private oneSignal: OneSignal, */
    private auth: AuthService,
    /* private geolocation: Geolocation, */
    public zone: NgZone,
  ) { 
    /* this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = []; */ }

  async ngOnInit() {
    let producerId: string;
    this.subscriptions = this.route.params.subscribe(async (params) => {
      producerId = params['producerId'];
    });
    this.order = this.md.orderData;
      
    this.user = await this.auth.user;
    if (!this.user.address) {
      this.presentAddProfileData();
    } else {
      if (this.user.city) {
        this.deliveryAddress = this.user.city + ', ' + this.user.address;
        this.telephoneNumber = this.user.phone;
      } else {
        this.deliveryAddress = this.user.address;
        this.telephoneNumber = this.user.phone;
      }
      this.deliveryNumber = 1;
    }

  }

  async presentConfirmOrder() {
    this.confirmOrder();
  }

    //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
    UpdateSearchResults(){
      const center = { lat: 45.898136138916016, lng: 16.842958450317383 };
      // Create a bounding box with sides ~10km away from the center point
      const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1,
      };
      /* let myLatlng = new google.maps.LatLng(45.898136138916016,16.842958450317383);

      if (this.autocomplete.input == '') {
        this.autocompleteItems = [];
        return;
      }
      this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input, types: ['address'], componentRestrictions: {country: 'hr'}, radius: 15000, location: myLatlng,},
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      }); */
    }
    
    SelectSearchResult(item) {
      this.autocomplete.input = item.structured_formatting.main_text;
      this.deliveryAddress = item.structured_formatting.main_text;
      this.autocompleteItems = [];
    }

  sendOrderNotificationToProducer() {
    /* this.oneSignal.postNotification({
      headings: {en: "Primitak narudžbe"},
      contents: {en: `Zaprimili ste narudžbu od korisnika ${this.order.lastName} u iznosu od ${Number(this.totalPrice).toFixed(2)} kn.`},
      data: {
        "order_status": "ordered",
        "sender": "user"
      },
      include_player_ids: [this.order.producerPlayerId],
    }) */
  }

  async confirmOrder() {
    if (!this.user.address) {
      this.deliveryAddress = this.deliveryAddress + ' ' + this.deliveryNumber;
      const phone = String(this.telephoneNumber);
      const userAddress = {phone: phone, address: this.deliveryAddress};
      await this.auth.updateUserProfile(userAddress, false);
    }
    let order = {
      orderedProducts: this.order.products.map(product => {
        return {  
          productId: product.id,
          quantity: product.orderQuantity,
          productNote: product.productNote,
          foodExtras: product.foodExtras ? product.foodExtras.map((foodExtra) => {return {foodExtraId: foodExtra.id, quantity: 1}}) : []
        }
      }),
      deliveryAddress: this.deliveryAddress,
      objectId: this.order.producerId,
      deliveryNote: this.note,
      pickupType: this.pickupType === 'RESTAURANT_DELIVERY' ? 1 : 3
    }

    if (!order.orderedProducts.foodExtras) {
      delete order.orderedProducts.foodExtras;
    }
    const createdOrder = await this.md.createOrder(order);
    if (this.order.producerPlayerId && createdOrder) {
      this.sendOrderNotificationToProducer();
    }
    this.md.userProductsList = [];
    this.router.navigateByUrl('/home/orders', { replaceUrl: true });
  }

  async presentAddProfileData() {
    /* const alert = await this.alertController.create({
      header: 'Unesite podatke',
      message:
        'Molimo Vas da unesete podatke potrebne za dostavu.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.searchInput.setFocus();
          },
        },
      ],
    });

    await alert.present(); */
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
