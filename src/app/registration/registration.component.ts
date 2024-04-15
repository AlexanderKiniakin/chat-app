import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {  
  private recaptchaVerifier: any = firebase.auth.RecaptchaVerifier; 
  public router: any = Router; 
  public termsChecked = false;
  public privacyChecked = false;
  public visibility = false;    

  constructor(
    private afAuth: AngularFireAuth,
    public authService: AuthService    
  ) {}

  phoneNumberInput() {    
    const modifiedPhoneNumber = this.authService.phoneNumber.replace(/[^0-9]/g, '');  
    const last9Digits = modifiedPhoneNumber.slice(-9);    
    this.authService.phoneNumber = last9Digits;
  }
}

