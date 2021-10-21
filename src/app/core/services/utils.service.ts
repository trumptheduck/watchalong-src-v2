import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  makeId(length:number) {
    var result           = '';
    var characters       = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
  charactersLength));
   }
   return result;
  }
  cors(url:string) {
    const encodedURL = encodeURIComponent(url);
    return `https://api.allorigins.win/get?url=${encodedURL}`
  }
}
