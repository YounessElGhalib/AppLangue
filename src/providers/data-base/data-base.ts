import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

const DATABASE_FILE_NAME: string = 'data.db';

@Injectable()
export class DataBaseProvider {

  private db: SQLiteObject;

  constructor(public http: Http, public sqlite: SQLite) {
    this.createDatabaseFile();
  }

  private createDatabaseFile(): void {
    this.sqlite.create({
      name: DATABASE_FILE_NAME,
      location: 'default'
    }).then((db: SQLiteObject) => {
      console.log('bdd created !');
      this.db = db;
      this.createTablesF();
      this.createTablesEn();
      this.createTablesTest();
    }).catch(e => console.log(e));
  }

  private createTablesF(): void {
    this.db.executeSql('CREATE TABLE IF NOT EXISTS "French" ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `word` TEXT NOT NULL UNIQUE, `translat` TEXT NOT NULL, `adate` TEXT NOT NULL )', {})
      .then(() => console.log('table french created !'))
      .catch(e => console.log(e));
  }

  private createTablesEn(): void {
    this.db.executeSql('CREATE TABLE IF NOT EXISTS "English" ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `word` TEXT NOT NULL UNIQUE, `translat` TEXT NOT NULL, `adate` TEXT NOT NULL )', {})
      .then(() => console.log('table french created !'))
      .catch(e => console.log(e));
  }

  private createTablesTest(): void {
    this.db.executeSql('CREATE TABLE IF NOT EXISTS "test" ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `adate` INTEGER NOT NULL, `type` TEXT NOT NULL, `note` TEXT NOT NULL, `langue` TEXT NOT NULL )', {})
      .then(() => console.log('table test created !'))
      .catch(e => console.log(e));
  }

  public saveWord(langue, ngWord, ngTranslation, adate) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("INSERT INTO '" + langue + "'(word, translat, adate) VALUES ('" + ngWord + "','" + ngTranslation + "','" + adate + "')", {})
        .then((data) => resolve('Ok'))
        .catch((error) => console.log('the word is not saved : ' + error));
    });
  }

  public saveTest(adate, type, note, langue) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("INSERT INTO 'test' (adate, type, note, langue) VALUES (" + adate + ",'" + type + "','" + note + "','" + langue + "')", {})
        .then((data) => resolve('Ok'))
        .catch((error) => console.log('the test is not saved : ' + error));
    });
  }



  getAllTests() {
    let TabFrench = [];
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM 'Test'", {})
        .then((data) => {

          if (data == null) {
            return
          }

          if (data.rows) {
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                TabFrench.push({
                  id: i,
                  adate: data.rows.item(i).adate,
                  type: data.rows.item(i).type,
                  note: data.rows.item(i).note,
                  langue: data.rows.item(i).langue,
                  count: data.rows.length
                });
              }
            }
          }
          resolve(TabFrench);
        });
    });
  }



  public deleteTest(adate) {
    var res;
    return new Promise((resolve, reject) => {
      this.db.executeSql("DELETE FROM 'test' WHERE adate='" + adate + "'", {})
        .then((data) => {

          if (data == null) {
            return;
          }

          if (data.rows) {
            res = 'deleted';
          }
          resolve(res);
        });
    });
  }




  chercheByWord(langue, word) {
    var res;
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM '" + langue + "' WHERE word='" + word + "'", {})
        .then((data) => {

          if (data == null) {
            return;
          }

          if (data.rows) {
            if (data.rows.length > 0) {
              res = 'exist';
            } else {
              res = 'not';
            }
          }
          resolve(res);
        });
    });
  }



  chercheByDate(langue, adate) {
    var res;
    let TabFrench = [];
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM '" + langue + "' WHERE adate='" + adate + "'", {})
        .then((data) => {
          if (data == null) {
            return;
          }
          if (data.rows) {
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                TabFrench.push({
                  id: i,
                  word: data.rows.item(i).word,
                  translation: data.rows.item(i).translat,
                  adate: data.rows.item(i).adate,
                  count: data.rows.length
                });
              }
              res = 'exist';
            } else {
              res = 'not';
            }
          }
          if (res == 'exist') {
            resolve(TabFrench);
          } else
            resolve(res);
        });
    });
  }


  public getMaxId(langue) {
    let res = 0;
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT  MAX(id) as idMax FROM '" + langue + "'", {})
        .then((data) => {
          if (data == null) {
            return
          }
          if (data.rows) {
            if (data.rows.length > 0) {
              res = data.rows.item(0).idMax;
            } else {
              res = 0;
            }
          }
          resolve(res);
        });
    });
  }



  public getById(langue, id) {
    let tab = [];
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM '" + langue + "' WHERE id = '"+id+"'", {})
        .then((data) => {
          if (data == null) {
            return
          }
          if (data.rows) {
            if (data.rows.length > 0) {
              tab.push({
                id: data.rows.item(0).id,
                word: data.rows.item(0).word,
                translat: data.rows.item(0).translat
              });
            }
          }
          resolve(tab);
        });
    });
  }



  getAllWords(langue) {
    let TabFrench = [];
    return new Promise((resolve, reject) => {
      this.db.executeSql('SELECT * FROM "' + langue + '"', {})
        .then((data) => {

          if (data == null) {
            return
          }

          if (data.rows) {
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                TabFrench.push({
                  id: i,
                  word: data.rows.item(i).word,
                  translation: data.rows.item(i).translat,
                  adate: data.rows.item(i).adate,
                  count: data.rows.length
                });
              }
            }
          }
          resolve(TabFrench);
        });
    });
  }



  public deleteWord(langue, word) {
    var res;
    return new Promise((resolve, reject) => {
      this.db.executeSql("DELETE FROM '" + langue + "' WHERE word='" + word + "'", {})
        .then((data) => {

          if (data == null) {
            return;
          }

          if (data.rows) {
            res = 'deleted';
          }
          resolve(res);
        });
    });
  }
}
