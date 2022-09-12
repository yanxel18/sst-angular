import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as SSTModel from '../../store/model/model';
import { HttpErrorHandlerService, HandleError } from 'src/error-handler/http-error-handler.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};
@Injectable({ providedIn: 'root' })
export class CLoginService {

  private sstAPIURL: string = environment.LoginUrl;
  public isLogin = localStorage.getItem('access_token');
  private handleError: HandleError;
  constructor(
    private http: HttpClient,
    httpErrorhandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorhandler.createHandleError('SSTシステムログイン');
  }

  postLogin(x: SSTModel.LoginInterface): Observable<any>{
    const url =`${this.sstAPIURL}/authenticate`;
    return this.http.post<any>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('Login',[]))
    );
  }
}
