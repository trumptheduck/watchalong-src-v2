import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpsService } from './https.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class YTService {
  suggestions: string[] = [];
  results: any[] = [];

  constructor(
    private https: HttpsService,
    private API: ApiService,
    private utils: UtilsService
  ) { }
  getSuggestions(query:string):void {
    if (query !== '') {
      var url = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${query}`;
      this.https.get(this.utils.cors(url)).subscribe({'next': (data:any)=>{
        this.suggestions = JSON.parse(data.contents)[1];
      }});
    } else {
      this.suggestions = [];
    }
  }
  getResults(query:string):void {
    if (query !== '') {
      this.API.get(`apis/search?query=${query}`)
      .subscribe({'next':(data)=>{
        this.results = data.data.items;
        console.log(this.results);
      }});
    }
  }
  getVideoData(id:string):Observable<any> {
    return this.https.get("https://noembed.com/embed?url=https://www.youtube.com/watch?v="+id) 
  }
  getVideoIdFromUrl(url:string):string {
    if(url.search("youtu.be") !== -1) {
      var tokens = url.split("/");
      return tokens[tokens.length-1];
    } else if (url.search("youtube") !== -1) {
      return url.split("?v=")[1].split("&")[0]
    } else {
      return '';
    }
  }
}
