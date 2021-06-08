import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private spinner: NgxSpinnerService) { }

  async showSpinner() {
    await this.spinner.show(undefined, { fullScreen: true });
  }

  async hideSpinner() {
    await this.spinner.hide(undefined);
  }
}
