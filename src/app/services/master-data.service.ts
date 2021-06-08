import { Injectable } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from '../interfaces/order.interface';
import { ObjectResource } from '../interfaces/object.interface';
import { User } from '../interfaces/user.interface';
import { Product } from '../interfaces/product.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  categories: Array<any> = [];
  producerProducts: Array<any> = [];
  producer: ObjectResource;
  deliverers: User[];
  userOrders: Array<any> = [];
  userProductsList: Array<any> = [];
  isFetching = false;
  objectDailyStats: any;
  objectDelivererDailyStats: any;

  orderData: any;

  constructor(
    private toast: ToastrService,
    private spinner: SpinnerService,
    private _http: HttpClient
  ) { }

  async getProducers(): Promise<ObjectResource[]> {
    try {
      return await this._http.get<ObjectResource[]>(`${environment.API_URL}/objects/app`).toPromise();
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja profila`);
    }
  }
  
  async getTopOfferProducts(): Promise<Product[]> {
    try {
        console.log(environment)
      return await this._http.get<Product[]>(`${environment.API_URL}/products/top-offers`).toPromise();
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja profila top-selling-products`);
    }
  }
  async getMostOrderedProducts(): Promise<Product[]> {
    try {
      return await this._http.get<Product[]>(`${environment.API_URL}/order-items/top-selling-products/app`).toPromise();
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja profila top-offer-products`);
    }
  }

  async getProducer(objectId: string): Promise<ObjectResource> {
    try {
      const user = await this._http.get<ObjectResource>(`${environment.API_URL}/objects/app/${objectId}`).toPromise();
      return user;
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja profila proizvodaca`);
    }
  }

  async getProducerProducts(objectId: string): Promise<Product[]> {
    try {
      return await this._http.get<Product[]>(`${environment.API_URL}/categories/products/app/${objectId}`).toPromise();
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja profila`);
    }
  }

  async getUserOrders(): Promise<Order[]> {
    try {
      const orders = await this._http.get<Order[]>(`${environment.API_URL}/orders/app`).toPromise();
      this.isFetching = false;
      return orders;
    }
    catch (e) {
      this.isFetching = false;
      this.toast.show(`Greška prilikom dohvaćanja narudžbi`);
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    try {
      return await this._http.get<Order>(`${environment.API_URL}/orders/${orderId}`).toPromise();
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja profila`);
    }
  }

  async updateOrderStatus(orderId: number, orderData: any) {
    try {
      const data = await this._http.patch<Order>(`${environment.API_URL}/orders/update/${orderId}`, orderData).toPromise();
      if (orderData.status === 3) {
        this.toast.show(`Narudžba otkazana.`);
      } 
      if (orderData.status === 2) {
        this.toast.show(`Narudžba prihvaćena.`);
      } 
      return data;
    }
    catch (e) {
      this.toast.show(`Greška prilikom promjene statusa narudžbe`);
    }
  }

  async createOrder(order: any): Promise<boolean> {
    try {
      await this._http.post<{ id: number, role: number, firstName: string }>
        (`${environment.API_URL}/orders`, order).toPromise();

      return true;
    }
    catch (e) {
      this.toast.show(e.error.message);
      return false;
    }
  }

  async repeatOrder(order: any): Promise<boolean> {
    try {
      await this._http.post<{ id: number, role: number, firstName: string }>
        (`${environment.API_URL}/orders/reorder`, order).toPromise();
        this.toast.show(`Kreirana narudžba`);

      return true;
    }
    catch (e) {
      this.toast.show(e.error.message);
      return false;
    }
  }

  async postScore(score: number): Promise<void> {
    try {
      await this._http.post<{ score: number}>
        (`${environment.API_URL}/scores`, {score}).toPromise();
    }
    catch (e) {
      await this.spinner.hideSpinner();
      this.toast.show(`Greška prilikom slanja rezultata`);
    }
  }

  async getScores(currentMonth: number): Promise<any[]> {
    try {
      const scores = await this._http.get<any>(`${environment.API_URL}/scores/monthly-highscore?currentMonth=${currentMonth}`).toPromise();
      return scores;
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja dostavljača`);
    }
  }

  async getHighScore(): Promise<any[]> {
    try {
      const scores = await this._http.get<any>(`${environment.API_URL}/scores/monthly-highscore`).toPromise();
      return scores;
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja dostavljača`);
    }
  }

  async getHasOrderToday(): Promise<boolean> {
    try {
      const scores = await this._http.get<any>(`${environment.API_URL}/orders/has-orders-today`).toPromise();
      return scores.status;
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja dostavljača`);
    }
  }

  async getObjectDeliverers(objectId: number): Promise<User[]> {
    try {
      const deliverers = await this._http.get<any>(`${environment.API_URL}/users/object/deliverers/${objectId}`).toPromise();
      return deliverers;
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja dostavljača`);
    }
  }

  async getObjectMontlyStats(objectId: number): Promise<any[]> {
    try {
      const stats = await this._http.get<any>(`${environment.API_URL}/orders/monthly/stats/${objectId}`).toPromise();
      return stats;
    }
    catch (e) {
      //this.toast.show(`Greška prilikom dohvaćanja dostravljača`);
    }
  }

  async getObjectDeliverersMontlyStats(objectId: number): Promise<any[]> {
    try {
      const stats = await this._http.get<any>(`${environment.API_URL}/orders/stats/deliverers/monthly/${objectId}`).toPromise();
      return stats;
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja dostravljača`);
    }
  }

  async getObjectDailyStats(objectId: number, monthNumber: number): Promise<any[]> {
    try {
      const stats = await this._http.get<any>(`${environment.API_URL}/orders/daily/stats/${objectId}?monthOrdinal=${monthNumber}`).toPromise();
      return stats;
    }
    catch (e) {
      //this.toast.show(`Greška prilikom dohvaćanja dostravljača`);
    }
  }

  async getObjectDeliverersDailyStats(delivererId: number, monthNumber: number): Promise<any[]> {
    try {
      const stats = await this._http.get<any>(`${environment.API_URL}/orders/restaurant/deliverer/stats/daily/${delivererId}?monthOrdinal=${monthNumber}`).toPromise();
      return stats;
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja dnevnih statistika za dostavljace`);
    }
  }
}
