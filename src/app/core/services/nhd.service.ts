import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NhdService {

  constructor(
    private API: ApiService
  ) { }
  getData(url:string) {
    console.log("aaa")
    return this.API.get(`apis/getlink?url=`+url);
  }
}
