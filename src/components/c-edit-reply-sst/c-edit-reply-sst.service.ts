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
export class CEditReplySstService {
  private sstAPIURL: string = environment.APIURL;
  private sstFileURL: string = environment.DownloadURL
  private handleError: HandleError;
  constructor(
    private http: HttpClient,
    httpErrorhandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorhandler.createHandleError('SSTシステム');
   }

  postUpdateSSTReply(x: SSTModel.SSTFormReply): Observable<SSTModel.SSTFormReply[]>{
    const url =`${this.sstAPIURL}/sst/postUpdateSSTReply`;
    return this.http.post<SSTModel.SSTFormReply[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('postUpdateSSTReply',[]))
    );
  }

  getSSTFileReplyList(x: number | undefined): Observable<SSTModel.SSTFilesReply[]>{
    const url =`${this.sstFileURL}/sstfilelist/reply/${x}`;
    return this.http.get<SSTModel.SSTFilesReply[]>(url).pipe(
      catchError(this.handleError('getSSTFileReplyList',[]))
    );
  }

  getReasonList(): Observable<SSTModel.ReasonList[]>{
    const url =`${this.sstAPIURL}/sst/getReasonList`;
    return this.http.get<SSTModel.ReasonList[]>(url).pipe(
      catchError(this.handleError('getReasonList',[]))
    );
  }


/**not yet fix below service */
  postDeleteSSTReplyFile(x: SSTModel.SSTFilesReply[] | undefined): Observable<any>{
    const url =`${this.sstFileURL}/deletefile/reply`;
    return this.http.post<SSTModel.SSTFilesReply[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('postDeleteSSTReplyFile',[]))
    );
  }
  postUploadReplyFile(formData: FormData,replyrowid: number | undefined): Observable<any>{
    const url =`${this.sstAPIURL}/sst/upload/single/replyfile/${replyrowid}`;
    return this.http.post<any>(url, formData).pipe(
      catchError(this.handleError('ファイルアップロード',[]))
    );

  }
}
