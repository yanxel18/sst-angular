import { HttpHeaders,HttpClient, HttpParams } from '@angular/common/http';
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
const httpOptionsUpload = {
  headers: new HttpHeaders({
    'Content-Type': 'x-www-form-urlencoded'
  })
};

@Injectable({ providedIn: 'root' })
export class CCreateSstManualService {
  private sstAPIURL: string = environment.APIURL;
  private handleError: HandleError;
  constructor(
    private http: HttpClient,
    httpErrorhandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorhandler.createHandleError('CreateSSTService');
  }
  public docNumber: string | null | undefined ;
/**
 *
 * @returns baselist MST,KKTY,JTY etc..
 */
  getBaseList(): Observable<SSTModel.IBase[]>{
    const url =`${this.sstAPIURL}/sst/getBaseList`;
    return this.http.get<SSTModel.IBase[]>(url).pipe(
      catchError(this.handleError('getBaseList',[]))
    );
  }
/**
 *
 * @returns Machines List 設備
 */
  getMachineList(): Observable<SSTModel.MachineList[]>{
    const url =`${this.sstAPIURL}/sst/getMachineList`;
    return this.http.get<SSTModel.MachineList[]>(url).pipe(
      catchError(this.handleError('getMachineList',[]))
    );
  }
/**
 *
 * @returns 工程list
 */
  getProcessList(): Observable<SSTModel.ProcessList[]>{
    const url =`${this.sstAPIURL}/sst/getProcessList`;
    return this.http.get<SSTModel.ProcessList[]>(url).pipe(
      catchError(this.handleError('getProcessList',[]))
    );
  }
/**
 *
 * @returns Tools List
 */
  getToolsListAction(): Observable<SSTModel.ToolsListAction[]>{
    const url =`${this.sstAPIURL}/sst/getToolsListAction`;
    return this.http.get<SSTModel.ToolsListAction[]>(url).pipe(
      catchError(this.handleError('getToolsListAction',[]))
    );
  }
  /**
   *
   * @returns 分析Tools
   */
  getToolsListAnalysis(): Observable<SSTModel.ToolsListAnalysis[]>{
    const url =`${this.sstAPIURL}/sst/getToolsListAnalysis`;
    return this.http.get<SSTModel.ToolsListAnalysis[]>(url).pipe(
      catchError(this.handleError('getToolsListAnalysis',[]))
    );
  }
/**
 *
 * @returns 気づきTools
 */
  getToolsListAwareness(): Observable<SSTModel.ToolsListAwareness[]>{
    const url =`${this.sstAPIURL}/sst/getToolsListAwareness`;
    return this.http.get<SSTModel.ToolsListAwareness[]>(url).pipe(
      catchError(this.handleError('getToolsListAwareness',[]))
    );
  }
/**
 *
 * @returns 結果Tools
 */
  getToolsListResult(): Observable<SSTModel.ToolsListResult[]>{
    const url =`${this.sstAPIURL}/sst/getToolsListResult`;
    return this.http.get<SSTModel.ToolsListResult[]>(url).pipe(
      catchError(this.handleError('getToolsListResult',[]))
    );
  }
/**
 *
 * @param x pass data from create sst form
 * @returns returns error handler or success
 */
/*
  postCreateSST(x: SSTModel.ISSTForm): Observable<SSTModel.ISSTForm[]>{
    const url =`${this.sstAPIURL}/sst/postCreateSST`;
    return this.http.post<SSTModel.ISSTForm[]>(url, x, httpOptions)
    .pipe(
      catchError(this.handleError('CreateSST',[]))
    );
  }*/

  postUploadFile(formData: FormData): Observable<any>{
    const url =`${this.sstAPIURL}/sst/upload/${this.docNumber}`;
    return this.http.post<any>(url, formData).pipe(
      catchError(this.handleError('uploadFile',[]))
    );

  }

  getActivityList(): Observable<SSTModel.ActivityList[]>{
    const url =`${this.sstAPIURL}/sst/getActivityList`;
    return this.http.get<SSTModel.ActivityList[]>(url).pipe(
      catchError(this.handleError('getActivityList',[]))
    );
  }


  getActivityListonEdit(groupID: number | null | undefined): Observable<SSTModel.ActivityList[]>{
    let queryParams = new HttpParams();
    if (groupID)  queryParams = queryParams.append("stcID",groupID);
    const url =`${this.sstAPIURL}/sst/getActivityListonEdit`;
    return this.http.get<SSTModel.ActivityList[]>(url, {params: queryParams}).pipe(
      catchError(this.handleError('getActivityListonEdit',[]))
    );
  }

  getActivityListGroup(): Observable<SSTModel.ActivityListGroup[]>{
    const url =`${this.sstAPIURL}/sst/getActivityListGroup`;
    return this.http.get<SSTModel.ActivityListGroup[]>(url).pipe(
      catchError(this.handleError('getActivityListGroup',[]))
    );
  }

}
