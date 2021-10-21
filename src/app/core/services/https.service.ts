import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class HttpsService {
  constructor(private http: HttpClient) {}
  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${path}`)
      .pipe(catchError(this.handleError));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(`${path}`, body)
      .pipe(catchError(this.handleError));
  }

  patch(path: string, body: Object = {}): Observable<any> {
    return this.http
      .patch(`${path}`, body)
      .pipe(catchError(this.handleError));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(`${path}`, body)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: any) {
    return throwError(error.error);
  }
}