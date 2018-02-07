import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { DataBaseProvider } from '../../providers/data-base/data-base'

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  types: Array<{ value: number, type: string }>;
  words: Array<{ word: string, trans: string }>;
  tests: Array<{ adate: number, type: string, note: string, langue: string }>;
  tab = [];

  toasts: any;
  con: number = 0;
  theWord: string;
  ngTranslation: string;
  colors = [];
  langue: string;
  selectedtype: number;
  zoneDate: number;
  not: number;
  type: string;
  decalage: number;

  constructor(public navCtrl: NavController, private data: DataBaseProvider, public toast: ToastController) {
    this.types = [];
    this.tests = [];
    this.types.push({
      value: 1,
      type: 'French'
    });
    this.types.push({
      value: 2,
      type: 'English'
    });
    this.colorsVoid();
  }


  public afficherLaLangue() {
    for (var i = 0; i < this.types.length; i++) {
      if (this.types[i].value == this.selectedtype) {
        this.langue = this.types[i].type;
        this.type = null;
        this.theWord = null;
      }
    }
  }



  public deleteItem(word) {
    this.toasts = this.toast.create({
      duration: 3000
    });
    const index: number = this.words.indexOf(word);
    if (index != -1) {
      this.words.splice(index, 1);
      this.data.deleteWord(this.langue, word.word).then((res) => {
        if (res == "deleted") {
          this.toasts.setMessage("this word is deleted !");
          this.toasts.present();
        }
      });
    }
  }


  public colorsVoid() {
    this.colors = [];
    for (var i = 0; i < 10; i++) {
      this.colors.push({
        color: 'light',
        name: 'md-thumbs-up'
      });
    }
    this.not = 0;
    this.con = 0;
  }


  public continuous() {
    this.toasts = this.toast.create({
      duration: 3000
    });
    if (this.ngTranslation != null) {
      if (this.words[this.con].word == this.theWord) {
        if (this.words[this.con].trans == this.ngTranslation) {
          this.toasts.setMessage("Good !");
          this.colors[this.con].color = "secondary";
          this.colors[this.con].name = 'md-thumbs-up';
          this.ngTranslation = null;
          this.con++;
          this.not = this.not + 2;
          this.toasts.present();
        } else {
          this.toasts.setMessage("False ! " + this.words[this.con].trans);
          this.colors[this.con].color = "danger";
          this.colors[this.con].name = 'md-thumbs-down';
          this.ngTranslation = null;
          this.con++;
          this.toasts.present();
        }
        if (this.con >= 10) {
          this.theWord = null;
          this.toasts.setMessage("You finished the test !");
          this.toasts.present();
        } else {
          this.theWord = this.words[this.con].word;
        }
      }
    }
  }



  public start() {
    this.theWord = this.words[0].word;
    this.colorsVoid();
  }



  public lastD() {
    this.words = [];
    this.type = 'lastDay';
    this.data.getMaxId(this.langue).then((data: number) => {
      if (data >= 10) {
        let lenght = data - 10;
        this.random(10, lenght);
        for (var i = 0; i < this.tab.length; i++) {
          this.data.getById(this.langue, this.tab[i]).then(res => {
            this.words.push({
              word: res[0].word,
              trans: res[0].translat
            });
          });
        }
      } else {
        alert("We can't starting this Test, beceuas you don't have " + 10 + " in your tadabase. You need add more words");
        this.type = null;
      }
    }, (error) => {
      alert("error : " + error);
    });
  }


  public lastW() {
    this.words = [];
    this.type = 'lastWeek';
    this.data.getMaxId(this.langue).then((data: number) => {
      if (data >= 70) {
        let lenght = data - 70;
        this.random(70, lenght);
        for (var i = 0; i < this.tab.length; i++) {
          this.data.getById(this.langue, this.tab[i]).then(res => {
            this.words.push({
              word: res[0].word,
              trans: res[0].translat
            });
          });
        }
      } else {
        alert("We can't starting this Test, beceuas you don't have " + 70 + " in your tadabase. You need add more words");
        this.type = null;
      }
    }, (error) => {
      alert("error : " + error);
    });
  }


  public lastM() {
    this.words = [];
    this.type = 'lastMonth';
    this.data.getMaxId(this.langue).then((data: number) => {
      if (data >= 300) {
        let lenght = data - 300;
        this.random(300, lenght);
        for (var i = 0; i < this.tab.length; i++) {
          this.data.getById(this.langue, this.tab[i]).then(res => {
            this.words.push({
              word: res[0].word,
              trans: res[0].translat
            });
          });
        }
      } else {
        alert("We can't starting this Test, beceuas you don't have " + 300 + " in your tadabase. You need add more words");
        this.type = null;
      }
    }, (error) => {
      alert("error : " + error);
    });
  }


  public all() {
    this.words = [];
    this.type = 'All';
    this.data.getMaxId(this.langue).then((data: number) => {
      if (data >= 0) {
        this.random(data, 0);
        for (var i = 0; i < this.tab.length; i++) {
          this.data.getById(this.langue, this.tab[i]).then(res => {
            this.words.push({
              word: res[0].word,
              trans: res[0].translat
            });
          });
        }
      } else {
        alert("We can't starting this Test, beceuas you don't have any words in your tadabase. You need add more words");
        this.type = null;
      }
    }, (error) => {
      alert("error : " + error);
    });
  }


  public finish() {
    this.toasts = this.toast.create({
      duration: 3000
    });
    this.tests.push({
      adate: Date.now(),
      type: this.type,
      note: this.not + "/20",
      langue: this.langue
    });
    let note = this.not + "/20";
    let dt = Date.now();
    this.data.saveTest(dt, this.type, note, this.langue).then((res) => {
      if (res == "Ok") {
        this.toasts.setMessage("Test is saved !");
        this.not = 0;
        this.con = 0;
        this.type = null;
        this.toasts.present();
      }
    }).catch((error) => alert("The word not saved ! "));
  }


  public delete(test) {
    this.toasts = this.toast.create({
      duration: 3000
    });
    const index: number = this.tests.indexOf(test);
    if (index != -1) {
      this.tests.splice(index, 1);
      this.data.deleteTest(test.adate).then((res) => {
        if (res == "deleted") {
          this.toasts.setMessage("this Test is deleted !");
          this.toasts.present();
        }
      });
    }
  }


  public random(nomb, lenght) {
    this.tab = [];
    while (this.tab.length != nomb) {
      let ind = Math.floor(Math.random() * nomb) + lenght + 1;
      const index: number = this.tab.indexOf(ind);
      if (index == -1) {
        this.tab.push(ind);
      }
    }
  }

  public getLengthWord() {
    this.data.getMaxId(this.langue).then((data) => {
      if (data > 0) {
        for (var i = 0; i < this.tab.length; i++) {
          this.data.getById(this.langue, this.tab[i]).then(res => {
            alert(res[0].id + " / " + res[0].word + " / " + res[0].translat);
          });
        }
      }
    }, (error) => {
      alert("error : " + error);
    });
  }


}