import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get phone() { return this.registerForm.get('phone'); }
  get city() { return this.registerForm.get('city'); }
  get address() { return this.registerForm.get('address'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get checkedTerms() { return this.registerForm.get('checkedTerms'); }
  get ageGate() { return this.registerForm.get('ageGate'); }

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    city: ['', [Validators.required, Validators.minLength(4)]],
    address: ['', [Validators.required, Validators.minLength(4)]],
    checkedTerms: [false, [Validators.requiredTrue]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    ageGate: [false, [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) { }
  
  async goToTerms() {
    this.router.navigate([`/terms`]);
  }  
  
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async register() {
    let user = this.registerForm.value;
    user.firstName = this.capitalizeFirstLetter(user.firstName);
    user.lastName = this.capitalizeFirstLetter(user.lastName);
    user.city = this.capitalizeFirstLetter(user.city);
    user.address = this.capitalizeFirstLetter(user.address);
    user.ageGate = user.ageGate.toString();
    user.checkedTerms = user.checkedTerms.toString();
    let userCredential = await this.auth.register(user);
    const authUser = await this.auth.login(user.email, user.password);
    if (authUser && userCredential) {
      await this.auth.getUser();
      this.registerForm.reset();
      this.router.navigate(['']);
    }
  }

}