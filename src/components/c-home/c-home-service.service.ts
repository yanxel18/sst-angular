import { HttpHeaders, HttpClient } from '@angular/common/http';
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
const httpOptions2 = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
  })
};
@Injectable({ providedIn: 'root' })
export class CHomeServiceService {
  private sstAPIURL: string = environment.APIURL;
  private sstDownloadURL: string = environment.DownloadURL;
  private handleError: HandleError;
  constructor(
    private http: HttpClient,
    httpErrorhandler: HttpErrorHandlerService) {
    this.handleError = httpErrorhandler.createHandleError('SSTシステム');
  }
  /**
   *
   * @returns returns masterlist of SST
   */
  getSSTMasterList(): Observable<SSTModel.SSTMasterList[]> {
    const url = `${this.sstAPIURL}/sst/getSSTMasterList`;
    return this.http.get<SSTModel.SSTMasterList[]>(url).pipe(
      catchError(this.handleError('getSSTMasterList', []))
    );
  }
  getProgressSelectList(): Observable<SSTModel.ProgressSelectList[]> {
    const url = `${this.sstAPIURL}/sst/getProgressSelectList`;
    return this.http.get<SSTModel.ProgressSelectList[]>(url).pipe(
      catchError(this.handleError('getProgressSelectList', []))
    );
  }
  getToolsUsedList(): Observable<SSTModel.ToolsUsedList[]> {
    const url = `${this.sstAPIURL}/sst/getToolsUsedList`;
    return this.http.get<SSTModel.ToolsUsedList[]>(url).pipe(
      catchError(this.handleError('getToolsUsedList', []))
    );
  }
  getFileSST(docNumber: string | undefined, sstFiles: SSTModel.SSTReply[]): Observable<any> {
    const url = `${this.sstDownloadURL}/download/${docNumber}/files/${JSON.stringify(sstFiles)}`;
    return this.http.get<any>(url, { responseType: 'blob' as 'json' }).pipe(
      catchError(this.handleError('ダウンロードするものはありません！', []))
    );
  }
  getFileReplySST(replyrowID: number | undefined): Observable<any> {
    const url = `${this.sstDownloadURL}/download/reply/${replyrowID}`;
    return this.http.get<any>(url, { responseType: 'blob' as 'json' }).pipe(
      catchError(this.handleError('ダウンロードするものはありません！', []))
    );
  }
  getExportCSV(x: SSTModel.SSTExportListCSV): Observable<any> {
    const url = `${this.sstDownloadURL}/download/SSTMasterListCSV/${JSON.stringify(x)}`;
    return this.http.get<any>(url, { responseType: 'blob' as 'json' }).pipe(
      catchError(this.handleError('ダウンロードするものはありません！', []))
    );
  }
  postDeleteSST(x: SSTModel.SSTMasterList): Observable<SSTModel.SSTMasterList[]> {
    const url = `${this.sstAPIURL}/sst/postDeleteSST`;
    return this.http.post<SSTModel.SSTMasterList[]>(url, x, httpOptions)
      .pipe(
        catchError(this.handleError('postDeleteSST', []))
      );
  }
}
