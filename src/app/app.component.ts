import { Component, ViewChild } from "@angular/core";
import { Platform, Nav } from "ionic-angular";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { LocalWeatherPage } from "../pages/local-weather/local-weather";

import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


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
    public sqlite: SQLite,
    public dbobj: SQLiteObject
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
       this.splashScreen.show();
      // this.splashScreen.hide();

      //*** Control Status Bar
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);

      //*** Control Keyboard
      this.keyboard.disableScroll(true);

      //this.createDatabase();

      this.sqlite.create({
        name: "data.db",
         location: "default"
      }).then(() => {
        let s1 = this.dbobj.executeSql('CREATE TABLE IF NOT EXISTS alertas(' + 
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' + 
                'userid INTEGER, ' + 
                'titulo TEXT, ' +
                'tipo INTEGER, ' +
                'datos TEXT ' + 
                'status INTEGER ' +
                'creacion VARCHAR' +
                'entrega VARCHAR' + 
              ')').then((data) => {
          console.log("Alertas TABLE CREATED: ", data);
         }, (error) => {
           console.error("Alertas Unable to execute sql", error);
         });

         let s2 = this.dbobj.executeSql('CREATE TABLE IF NOT EXISTS sessions(' + 
              'sessionid TEXT PRIMARY KEY, ' + 
              'userid INTEGER, ' + 
              'nombres TEXT, ' +
              'apellidos TEXT, ' +
              'finalizacion VARCHAR' + 
              'activa INTEGER' + 
            ')').then((data) => {
              console.log("Alertas TABLE CREATED: ", data);
           }, (error) => {
               console.error("Alertas Unable to execute sql", error);
           });

           let s3 =  this.dbobj.executeSql('SELECT TOP 1 FROM sessions WHERE activa=1').then((data) => {
              console.log("Session selected: ", data);
              let session = [];
              if(data.rows.length>0){
                session.push(data.rows.item(0));
                this.splashScreen.hide();
                this.rootPage = 'HomePage';
              }else{
                session = null;
                this.splashScreen.hide();
                this.rootPage = 'LoginPage';
              }
           }, (error) => {
               console.error("Current Session Unable to execute sql", error);
           });


           return Promise.all([s1,s2,s3]);

       }, (error) => {
               console.error("Error el base de datos", error);
        });

      //

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

}
