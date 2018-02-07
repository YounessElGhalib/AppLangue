import { Component } from '@angular/core';
import { NavController, ToastController, ToastOptions } from 'ionic-angular';
import { DataBaseProvider } from '../../providers/data-base/data-base'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  types: Array<{ value: number, type: string }>;
  words: Array<{ word: string, trans: string }>;

  ngWord: string;
  ngTranslation: string;

  toastOption: ToastOptions;
  selectedtype: number;
  toasts: any;
  langue: string;
  adate: any;
  lengthWord: number;

  constructor(public navCtrl: NavController, private data: DataBaseProvider, public toast: ToastController) {
    this.types = [];
    this.words = [];

    this.types.push({
      value: 1,
      type: 'French'
    });
    this.types.push({
      value: 2,
      type: 'English'
    });
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
    this.lengthWord = 10 - (this.words.length);
  }


  public afficherLaLangue() {
    for (var i = 0; i < this.types.length; i++) {
      if (this.types[i].value == this.selectedtype) {
        this.langue = this.types[i].type;
      }
    }
  }


  public saveWordData() {
    this.adate = new Date();
    let valDate = this.adate.getFullYear() + '/' + ('0' + (this.adate.getMonth() + 1)).slice(-2) + '/' + ('0' + this.adate.getDate()).slice(-2);
    this.toasts = this.toast.create({
      duration: 3000
    });

    if (this.ngWord != null && this.ngTranslation != null) {

      this.data.chercheByWord(this.langue, this.ngWord).then((resu) => {
        if (resu == "exist") {
          alert("the " + this.ngWord + " is existed !");
        } else if (resu == "not") {
          this.data.saveWord(this.langue, this.ngWord, this.ngTranslation, valDate).then((res) => {
            if (res == "Ok") {
              this.words.push({
                word: this.ngWord,
                trans: this.ngTranslation
              });
              this.toasts.setMessage("Word is saved !");
              this.toasts.present();
              this.ngWord = null;
              this.ngTranslation = null;
              this.lengthWord = 10 - (this.words.length);
            }
          }).catch((error) => alert("The word not saved ! "));
        }
      });
    } else {
      this.toasts.setMessage("must fill all !");
      this.toasts.present();
    }
  }


  public list() {
    this.adate = new Date();
    let valDate = this.adate.getFullYear() + '/' + ('0' + (this.adate.getMonth() + 1)).slice(-2) + '/' + ('0' + this.adate.getDate()).slice(-2);
    this.words = [];
    this.data.chercheByDate(this.langue, valDate).then((data) => {
      if (data != "not") {
        for (var i = 0; i < data[0].count; i++) {
          this.words.push({
            word: data[i].word,
            trans: data[i].translation
          });
        }
        this.lengthWord = 10 - (this.words.length);
      } else {
        this.lengthWord = 10
      }
    }, (error) => {
      alert("error : " + error);
    });
  }


}
