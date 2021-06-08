import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';

import { SpinnerService } from './spinner.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
//import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AuthUser } from '../interfaces/auth-user.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userProfile: any;

  constructor(
    private toast: ToastrService,
    private spinner: SpinnerService,
    private _http: HttpClient,
    //private _oneSignal: OneSignal
  ) { }

  get authUser(): AuthUser {
    const authUser = localStorage.getItem('authUser');
    return JSON.parse(authUser);
  }

  get user(): User {
    const user = localStorage.getItem('user');
    return JSON.parse(user);
  }

  get playerId(): User {
    const playerId = localStorage.getItem('player_id');
    return JSON.parse(playerId);
  }

  async login(email: string, password: string): Promise<{ id: number, role: number }> {
    await this.spinner.showSpinner();
    try {
      const authUser = await this._http.post<AuthUser>
        (`${environment.API_URL}/auth/user/login/app`, { email, password }).toPromise();

      /* this._oneSignal.getPermissionSubscriptionState().then(async status => {
        const customerPlayerId = status.subscriptionStatus.userId;
        const user = {customerPlayerId: customerPlayerId}
        await this.updateUserProfile(user);
        this.storage.setItem('customerPlayerId', customerPlayerId);
      }); */

      localStorage.setItem('authUser', JSON.stringify(authUser));
      await this.getUser();

      await this.spinner.hideSpinner();
      return authUser;
    }
    catch (e) {
      await this.spinner.hideSpinner();
      this.toast.show(e.error.message);
    }
  }

  async statsLogin(email: string, password: string): Promise<{ id: number, role: number }> {
    try {
      const authUser = await this._http.post<AuthUser>
        (`${environment.API_URL}/auth/user/login/app`, { email, password }).toPromise();
      return authUser;
    }
    catch (e) {
      this.toast.show(e.error.message);
    }
  }

  /* async facebookLogin(facebookResponse: FacebookLoginResponse): Promise<{ id: number, role: number }> {
    await this.spinner.presentSpinner();
    try {
      const authUser = await this._http.get<AuthUser>
        (`${environment.API_URL}/auth/user/facebook/login/app?access_token=${facebookResponse.authResponse.accessToken}`).toPromise();

      this._oneSignal.getPermissionSubscriptionState().then(async status => {
        const customerPlayerId = status.subscriptionStatus.userId;
        const user = {customerPlayerId: customerPlayerId}
        await this.updateUserProfile(user);
        this.storage.setItem('customerPlayerId', customerPlayerId);
      });

      await this.storage.setItem('authUser', JSON.stringify(authUser));
      await this.getUser();

      await this.spinner.dismiss();
      return authUser;
    }
    catch (e) {
      await this.spinner.dismiss();
      this.toast.show(e.message);
    }
  } */

  async getUser() {
    try {
      const user = await this._http.get<User>(`${environment.API_URL}/users/profile/app`).toPromise();
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    catch (e) {
      this.toast.show(`Greška prilikom dohvaćanja profila`);
    }
  }

  async updateUserProfile(user: any, showToast?: boolean) {
    try {
      let resp = await this._http.patch(`${environment.API_URL}/users/profile/app`, user).toPromise();
        if (showToast) {
          this.toast.show('Korisnički profil ažuriran.');
        }
      return resp;
    }
    catch (e) {
      this.toast.show(`Greška kod ažuriranja korisničkog profila`);
    }
  }

  async register(user: any) {
    try {
      const data = await this._http.post(`${environment.API_URL}/auth/user/register/app`, user).toPromise();
      this.toast.show('Uspješna registracija. Prijavite se.');
      return data;
    }
    catch (e) {
      this.toast.show('Greška prilikom registracije');
    }
  }
}
