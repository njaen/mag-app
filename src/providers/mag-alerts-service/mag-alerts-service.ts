import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the MagAlertsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MagAlertsServiceProvider {

  db: SQLiteObject;

  constructor() {}

  setDatabase(db: SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  createTable(){
	  let sql = 'CREATE TABLE IF NOT EXISTS alertas(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed INTEGER)';
	  	return this.db.executeSql(sql, []);
	}


	getAll(){
	  let sql = 'SELECT * FROM alertas';
	  return this.db.executeSql(sql, [])
	  .then(response => {
	    let tasks = [];
	    for (let index = 0; index < response.rows.length; index++) {
	      tasks.push( response.rows.item(index) );
	    }
	    return Promise.resolve( tasks );
	  })
	  .catch(error => Promise.reject(error));
	}

	create(alerta: any){
	  let sql = 'INSERT INTO alertas(title, completed) VALUES(?,?)';
	  return this.db.executeSql(sql, [alerta.title, alerta.completed]);
	}

	delete(alerta: any){
	  let sql = 'DELETE FROM alertas WHERE id=?';
	  return this.db.executeSql(sql, [alerta.id]);
	}

	update(alerta: any){
	  let sql = 'UPDATE alertas SET title=?, completed=? WHERE id=?';
	  return this.db.executeSql(sql, [alerta.title, alerta.completed, alerta.id]);
	}
}

