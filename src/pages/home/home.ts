import { Component } from '@angular/core';
import { NavController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { InAppBrowser } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public feeds: Array<any>;
  private url: string = "https://www.reddit.com/new.json";
  private newerPosts: string = "https://www.reddit.com/new.json?before=";  
  private olderPosts: string = "https://www.reddit.com/new.json?after=";

  public hasFilter: boolean = false;
  public noFilter: Array<any>;

  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController) {

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

        this.noFilter = this.feeds;  

        loading.dismiss();
      });  
  }

  doRefresh(refresher) {

    let paramsUrl = this.feeds[0].data.name;

    this.http.get(this.newerPosts + paramsUrl).map(res => res.json())
      .subscribe(data => {
      
        this.feeds = data.data.children.concat(this.feeds);
        
        this.feeds.forEach((e, i, a) => {
          if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {  
            e.data.thumbnail = 'http://www.redditstatic.com/icon.png';
          }
        })

        this.noFilter = this.feeds;
        this.hasFilter = false;

        refresher.complete();
      });
  }  

  doInfinite(infiniteScroll) {

    let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1].data.name : "";

      this.http.get(this.olderPosts + paramsUrl).map(res => res.json())
        .subscribe(data => {
        
          this.feeds = this.feeds.concat(data.data.children);
          
          this.feeds.forEach((e, i, a) => {
            if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {  
              e.data.thumbnail = 'http://www.redditstatic.com/icon.png';
            }
          })

          this.noFilter = this.feeds;
          this.hasFilter = false;          
          
          infiniteScroll.complete();
        }); 
  }   

  itemSelected (url: string):void {
    let browser = new InAppBrowser(url, '_system');
  } 
  
  showFilters() :void {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Filter options:',
      buttons: [
        {
          text: 'Music',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "music");
            this.hasFilter = true;
          }
        },
        {
          text: 'Movies',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "movies");
            this.hasFilter = true;
          }
        },
        {
          text: 'Games',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "gaming");
            this.hasFilter = true;
          }
        },
        {
          text: 'Pictures',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "pics");
            this.hasFilter = true;
          }
        },                
        {
          text: 'Ask Reddit',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "askreddit");
            this.hasFilter = true;
          }
        },        
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.feeds = this.noFilter;
            this.hasFilter = false;
          }
        }
      ]
    });

    actionSheet.present();

  }        

}
