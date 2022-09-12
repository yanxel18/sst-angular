import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as SSTModel from '../store/model/model';
import { HttpErrorHandlerService, HandleError } from 'src/error-handler/http-error-handler.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({ providedIn: 'root' })
export class AppService {
  private sstUserUrl: string = environment.LoginUrl;
  private sstAPIURL: string = environment.APIURL;
  private sstPublicURL: string = environment.DownloadURL;
  private handleError: HandleError;
  constructor(
    private http: HttpClient,
    httpErrorhandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorhandler.createHandleError('SSTシステム');
  }
  getManual(): Observable<any> {
    const manualFileName = "SST進捗管理システム_操作マニュアル.pptx";
    const url = `${this.sstPublicURL}/public/manual`;
    return this.http.get<any>(url, { responseType: 'blob' as 'json',
      headers: {'Accept': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'}}).pipe(
      catchError(this.handleError('ダウンロードするものはありません！', []))
    );
  }
  getUserInfo(): Observable<SSTModel.UserInfo[]>{
    const url =`${this.sstUserUrl}/userinfo`;
    return this.http.get<SSTModel.UserInfo[]>(url).pipe(
      catchError(this.handleError('UserInfo',[]))
    );
  }
  getUserList(): Observable<SSTModel.UserInfo[]>{
    const url =`${this.sstUserUrl}/userlist`;
    return this.http.get<SSTModel.UserInfo[]>(url).pipe(
      catchError(this.handleError('UserList',[]))
    );
  }

  postLogout(): Observable<any>{
    const url =`${this.sstUserUrl}/logout`;
    return this.http.get<any>(url,httpOptions).pipe(
      catchError(this.handleError('LogOut',[]))
    );
  }

  getRegistrationList(): Observable<SSTModel.RegistrationDropList[]>{
    const url =`${this.sstAPIURL}/sst/getregistrationlist`;
    return this.http.get<SSTModel.RegistrationDropList[]>(url).pipe(
      catchError(this.handleError('getToolsListAnalysis',[]))
    );
  }


  postRegisterUser(x: SSTModel.RegisterUserInfo): Observable<SSTModel.RegisterUserInfo[]>{
    const url =`${this.sstAPIURL}/sst/account/register`;
    return this.http.post<SSTModel.RegisterUserInfo[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('ユーザー登録',[]))
    );
  }
  postUpdateUser(x: SSTModel.RegisterUserInfo): Observable<SSTModel.RegisterUserInfo[]>{
    const url =`${this.sstUserUrl}/user/update`;
    return this.http.post<SSTModel.RegisterUserInfo[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('ユーザー更新',[]))
    );
  }
  postUpdatePass(x: SSTModel.RegisterUserInfo): Observable<SSTModel.RegisterUserInfo[]>{
    const url =`${this.sstUserUrl}/user/update/pass`;
    return this.http.post<SSTModel.RegisterUserInfo[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('ユーザー更新',[]))
    );
  }

  postCreateBase(x: SSTModel.CreateBase): Observable<SSTModel.CreateBase[]>{
    const url =`${this.sstAPIURL}/sst/postCreateBase`;
    return this.http.post<SSTModel.CreateBase[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('拠点作成',[]))
    );
  }

  postUpdateBase(x: SSTModel.UpdateBase): Observable<SSTModel.UpdateBase[]>{
    const url =`${this.sstAPIURL}/sst/postUpdateBase`;
    return this.http.post<SSTModel.UpdateBase[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('拠点更新',[]))
    );
  }

  postUpdateActivityList(x: SSTModel.UpdateActivity): Observable<SSTModel.UpdateActivity[]>{
    const url =`${this.sstAPIURL}/sst/postUpdateActivityList`;
    return this.http.post<SSTModel.UpdateActivity[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('活動内容更新',[]))
    );
  }

  postCreateActivityList(x: SSTModel.CreateActivity): Observable<SSTModel.CreateActivity[]>{
    const url =`${this.sstAPIURL}/sst/postCreateActivityList`;
    return this.http.post<SSTModel.CreateActivity[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('活動内容作成',[]))
    );
  }

  getDeleteAccount(id: number| undefined): Observable<SSTModel.UserInfo[]>{
    const url =`${this.sstUserUrl}/user/delete/${id}`;
    return this.http.get<SSTModel.UserInfo[]>(url).pipe(
      catchError(this.handleError('UserDelete',[]))
    );
  }

  enableActivityList(value: SSTModel.enableActivityList) : Observable<any>{
    const url =`${this.sstAPIURL}/sst/postEnableActivityList`;
    return this.http.post<SSTModel.enableActivityList[]>(url,value, httpOptions).pipe(
      catchError(this.handleError('EnableActivityList',[]))
    );
  }

  postCreateActivityGroup(value: SSTModel.createGroupActivityParam): Observable<SSTModel.createGroupActivityParam[]>{
    const url =`${this.sstAPIURL}/sst/postCreateActivityGroup`;
    return this.http.post<SSTModel.createGroupActivityParam[]>(url, value, httpOptions)
    .pipe(
      catchError(this.handleError('CreateActivityGroup',[]))
    );
  }

  postUpdateActivityGroup(value: SSTModel.updateActivityGroupParam): Observable<SSTModel.updateActivityGroupParam[]>{
    const url =`${this.sstAPIURL}/sst/postUpdateActivityGroup`;
    return this.http.post<SSTModel.updateActivityGroupParam[]>(url, value, httpOptions)
    .pipe(
      catchError(this.handleError('UpdateActivityGroup',[]))
    );
  }
}
