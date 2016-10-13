import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { InAppBrowser } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public feeds: Array<string>;
  private url: string = "https://www.reddit.com/new.json";  

  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController) {

    this.fetchContent();

  }

  fetchContent ():void {
    let loading = this.loadingCtrl.create({
      content: 'Fetching content...'
    });

    loading.present();

    this.http.get(this.url).map(res => res.json())
      .subscribe(data => {
        this.feeds = data.data.children;

        this.feeds.forEach((e, i, a) => {
          if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {  
            e.data.thumbnail = 'http://www.redditstatic.com/icon.png';
          }
        })
                
        loading.dismiss();
      });  
  }

  itemSelected (url: string):void {
    let browser = new InAppBrowser(url, '_system');
  }       

}
