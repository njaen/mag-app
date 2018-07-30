import { Component, ViewChild } from "@angular/core";
import { Platform, Nav } from "ionic-angular";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { LocalWeatherPage } from "../pages/local-weather/local-weather";

import { Storage } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';

import { MagAlertsServiceProvider } from '../providers/mag-alerts-service/mag-alerts-service';

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  appMenuItems: Array<MenuItem>;

  dataUser: any[];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public keyboard: Keyboard,
    public alertsService: MagAlertsServiceProvider,
    public sqlite: SQLite
  ) {
    this.initializeApp();

    this.appMenuItems = [
      {title: 'Inicio', component: HomePage, icon: 'home'},
      {title: 'Nueva Alerta', component: LocalWeatherPage, icon: 'md-add-circle'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      /*var currentUser = this.storage.get('currentUser');
      console.log(currentUser);
      let access = this.storage.get('currentAccess');
      if(access){
         this.rootPage = HomePage;
      }*/
      // Okay, so the platform is ready and our plugins are available.

      //*** Control Splash Screen
      // this.splashScreen.show();
      // this.splashScreen.hide();

      //*** Control Status Bar
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);

      //*** Control Keyboard
      this.keyboard.disableScroll(true);

      this.createDatabase();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    //this.storage.clear();
    this.nav.setRoot(LoginPage);
  }

   private createDatabase(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default' // the location field is required
    })
    .then((db) => {
      this.alertsService.setDatabase(db);
      return this.alertsService.createTable();
    })
    .then(() =>{
      this.splashScreen.hide();
      this.rootPage = 'HomePage';
    })
    .catch(error =>{
      console.error(error);
    });
  }

  

}
