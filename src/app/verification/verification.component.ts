import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit, OnDestroy {
  public digits: string [] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  public inputs: any[] = new Array(6).fill(null);
  public verificationCode = '';
  public router: any = Router;
  public counter = 59;
  private timerInterval: any;
  public disableResend = false;
  public visibility = true;
  public showPreloader = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.startTimer();
  }

  onDigitClick(digit: string) {
    const index = this.inputs.findIndex((input) => input === null);
    if (index !== -1) {
      this.inputs[index] = digit;
    }

    const codeComplete = this.inputs.every((input) => input !== null);
    if (codeComplete) {
      this.verificationCode = this.inputs.join('');
      this.showPreloader = true;
      this.verifyCode();
    }
  }

  resendCode() {
    console.log('Resending verification code...');
    this.authService.resendLoginCode();
    this.startTimer();
  }

  verifyCode() {
    this.authService.verificationCode = this.verificationCode;
    this.authService.verifyLoginCode();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  startTimer() {
    this.disableResend = true;

    this.timerInterval = setInterval(() => {
      this.counter--;

      if (this.counter === 0) {
        clearInterval(this.timerInterval);
        this.disableResend = false;
        this.visibility = false;
      }
    }, 1000);
  }

  getFormattedCounter(): string {
    return this.counter < 10 ? `0${this.counter}` : `${this.counter}`;
  }

  clearInputs() {
    let lastIndex = this.inputs.length - 1;
    while (lastIndex >= 0 && this.inputs[lastIndex] === null) {
      lastIndex--;
    }
    if (lastIndex >= 0) {
      this.inputs[lastIndex] = null;
    }
  }
}
