import {Component} from "@angular/core";
import {NavController, AlertController, ToastController, MenuController} from "ionic-angular";
import {HomePage} from "../home/home";
import {RegisterPage} from "../register/register";

import { LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  loading: Loading;
  registerCredentials = { email: '', password: '' };
 
  constructor(
    public nav: NavController, 
    private auth: AuthServiceProvider, 
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController,
    public menu: MenuController, 
    public toastCtrl: ToastController, 
    public forgotCtrl: AlertController){ 
      this.menu.swipeEnable(false);
    }

 /*constructor(
   public nav: NavController, 
   public forgotCtrl: AlertController, 
   public menu: MenuController, 
   public toastCtrl: ToastController) {
    this.menu.swipeEnable(false);
  }*/

  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  // login and go to home page
  login() {
    //this.nav.setRoot(HomePage);
    this.showLoading();
    //registerCredentials = { email: null, password: null };
    this.auth.login(this.registerCredentials).subscribe(allowed => 
      {
        if (allowed) {
                  
          this.nav.setRoot(HomePage);
        } else {
          this.showError("Acceso denegado");
        }
      },
      error => {
        this.showError(error);
      }
    );
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked');
            let toast = this.toastCtrl.create({
              message: 'Email was sended successfully',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }


  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Por favor espere...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
 showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

}
