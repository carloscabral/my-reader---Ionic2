import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RedditService {

  private feeds: Array<any>;

  constructor(private http: Http) {}

  fetchData(url: string): Promise<any> {
    
    return new Promise(resolve => {

      this.http.get(url).map(res => res.json())
        .subscribe(data => {
          this.feeds = data.data.children;
          
          this.feeds.forEach((e, i, a) => {
            if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {  
              e.data.thumbnail = 'http://www.redditstatic.com/icon.png';
            }
          })
          resolve(this.feeds);
        }, err => console.log(err));          
    });
  }
}
