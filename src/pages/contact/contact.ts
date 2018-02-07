import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { DataBaseProvider } from '../../providers/data-base/data-base'

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  words: Array<{ word: string, trans: string }>;
  tests: Array<{ adate: number, type: string, note: string, langue: string }>;

  toasts: any;
  langue: string;
  frenchLength: number;
  englishLength: number;

  constructor(public navCtrl: NavController, private data: DataBaseProvider, public toast: ToastController) {
    this.getAllTest();
    this.lengthFrench();
    this.lengthEnglish();
  }


  public doRefresh(refresher){
    this.words = [];
    this.getAllTest();
    this.lengthFrench();
    this.lengthEnglish();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }




  public lengthFrench() {
    this.langue = 'french';
    this.data.getAllWords(this.langue).then((data) => {
      this.frenchLength = data[0].count;
    });
  }

  

  public lengthEnglish() {
    this.langue = 'english';
    this.data.getAllWords(this.langue).then((data) => {
      this.englishLength = data[0].count;
    });
  }





  public fr_afficher() {
    this.langue = 'french';
    this.words = [];
    this.data.getAllWords(this.langue).then((data) => {
      for (var i = 0; i < data[0].count; i++) {
        this.words.push({
          word: data[i].word,
          trans: data[i].translation
        });
      }
    }, (error) => {
      alert("error : " + error);
    });
  }





  public en_afficher() {
    this.langue = 'english';
    this.words = [];
    this.data.getAllWords(this.langue).then((data) => {
      for (var i = 0; i < data[0].count; i++) {
        this.words.push({
          word: data[i].word,
          trans: data[i].translation
        });
      }
    }, (error) => {
      alert("error : " + error);
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
  }




  public getAllTest(){
    this.tests = [];
    this.data.getAllTests().then((data) => {
      for (var i = 0; i < data[0].count; i++) {
        this.tests.push({
          adate: data[i].adate,
          type: data[i].type,
          note: data[i].note,
          langue: data[i].langue
        });
      }
    }, (error) => {
      alert("error : " + error);
    });
  }





  public delete(test){
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
}
