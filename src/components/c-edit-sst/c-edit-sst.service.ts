import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as SSTModel from '../../store/model/model';
import { HttpErrorHandlerService, HandleError } from 'src/error-handler/http-error-handler.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({ providedIn: 'root' })
export class CEditSstService {
  private sstAPIURL: string = environment.APIURL;
  private sstFileURL: string = environment.DownloadURL
  private handleError: HandleError;
  constructor(
    private http: HttpClient,
    httpErrorhandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorhandler.createHandleError('CreateSSTService');
  }
  /**
   *
   * @param x Pass value from form
   * @returns returns handler error or success
   */
  postUpdateSST(x: SSTModel.ISSTForm): Observable<SSTModel.ISSTForm[]>{
    const url =`${this.sstAPIURL}/sst/postUpdateSST`;
    return this.http.post<SSTModel.ISSTForm[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('postUpdateSST',[]))
    );
  }

  postDeleteSSTFile(x: SSTModel.SSTFiles[] | undefined): Observable<any>{
    const url =`${this.sstFileURL}/deletefile`;
    return this.http.post<SSTModel.SSTFiles[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('postUpdateSST',[]))
    );
  }
  postUploadFile(formData: FormData,docNumber: string | undefined): Observable<any>{
    const url =`${this.sstAPIURL}/sst/upload/single/${docNumber}`;
    return this.http.post<any>(url, formData).pipe(
      catchError(this.handleError('uploadFile',[]))
    );

  }
  getSSTFileList(x: number | undefined): Observable<SSTModel.SSTFiles[]>{
    const url =`${this.sstFileURL}/sstfilelist/${x}`;
    return this.http.get<SSTModel.SSTFiles[]>(url).pipe(
      catchError(this.handleError('getSSTFileList',[]))
    );
  }
}
