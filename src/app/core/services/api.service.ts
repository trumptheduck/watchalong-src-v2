import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private https: HttpsService) { }

  get(path: string,params: HttpParams = new HttpParams()):Observable<any> {
    return this.https.get(`${environment.backend_url}/${path}`,params);
  }
  put(path: string, body: Object = {}): Observable<any> { 
    return this.https.put(`${environment.backend_url}/${path}`,body);
  }
  post(path: string, body: Object = {}): Observable<any> { 
    return this.https.post(`${environment.backend_url}/${path}`,body);
  }
  patch(path: string, body: Object = {}): Observable<any> { 
    return this.https.patch(`${environment.backend_url}/${path}`,body);
  }
}
