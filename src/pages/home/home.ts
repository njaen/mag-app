import {Component} from "@angular/core";
import {NavController, PopoverController, AlertController} from "ionic-angular";
import {Storage} from '@ionic/storage';

import {NotificationsPage} from "../notifications/notifications";
import {SettingsPage} from "../settings/settings";
import {TripsPage} from "../trips/trips";
import {SearchLocationPage} from "../search-location/search-location";

import { HttpProvider } from '../../providers/http/http';

import { MagAlertsServiceProvider } from '../../providers/mag-alerts-service/mag-alerts-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  // search condition
  public search = {
    name: "Rio de Janeiro, Brazil",
    date: new Date().toISOString()
  }

  usuarios : any[];
  alertas: any[] = [];

  constructor(
    private storage: Storage,
    public nav: NavController, 
    public popoverCtrl: PopoverController, 
    public http: HttpProvider,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public tasksService: MagAlertsServiceProvider
    ) {
  }

  ionViewWillEnter() {
    // this.search.pickup = "Rio de Janeiro, Brazil";
    // this.search.dropOff = "Same as pickup";
    this.storage.get('pickup').then((val) => {
      if (val === null) {
        this.search.name = "Rio de Janeiro, Brazil"
      } else {
        this.search.name = val;
      }
    }).catch((err) => {
      console.log(err)
    });
  }

  // go to result page
  doSearch() {
    this.nav.push(TripsPage);
  }

  // choose place
  choosePlace(from) {
    this.nav.push(SearchLocationPage, from);
  }

  // to go account page
  goToAccount() {
    this.nav.push(SettingsPage);
  }

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create(NotificationsPage);
    popover.present({
      ev: myEvent
    });
  }

  cargarUsuarios(){
    this.http.loadUsers().subscribe(
      (res) => { 
        this.usuarios = res['results'];
      },
      (error) =>{
        console.error(error);
      }
    )
  }


  openAlertNewTask(){
  let alert = this.alertCtrl.create({
    title: 'Crear tarea',
    message: 'escribe el nombre de la tarea',
    inputs: [
      {
        name: 'title',
        placeholder: 'Digitar nueva tarea.',
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        handler: () =>{
          console.log('cancelar');
        }
      },
      {
        text: 'Crear',
        handler: (data)=>{ 
          data.completed = false;
          this.tasksService.create(data)
          .then(response => {
            this.alertas.unshift( data );
          })
          .catch( error => {
            console.error( error );
          })
        }
      }
    ]
  });
  alert.present();
}

}

//
