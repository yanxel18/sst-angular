import { Component,OnInit } from '@angular/core';
import { CHomeServiceService } from '../c-home-service.service';
import { Observable, Subscription } from 'rxjs';
import * as SSTModel from '../../../store/model/model';
import * as SSTActions from 'src/store/actions/actions';
import * as SSTSelectors from 'src/store/selector/selectors';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';
import { CCreateSstManualService } from 'src/components/c-create-sst-manual/c-create-sst-manual.service';
import Swal from 'sweetalert2';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import {  MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-sstexport-dialog',
  providers: [CHomeServiceService, CCreateSstManualService],
  templateUrl: './sstexport-dialog.component.html',
  styleUrls: ['./.././c-home.component.sass']
})
export class SstexportDialogComponent implements OnInit {
  minDate!: Date;
  minSelectDate!: Date;
  maxDate!: Date;
  sstExportVal: SSTModel.SSTExportListCSV = {};
  constructor(
    public dialogRef: MatDialogRef<SstexportDialogComponent>,
    private cHomeService: CHomeServiceService,
    private ccreateSSTService: CCreateSstManualService,
    private store: Store<SSTModel.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,

  ) {
    this.initializeDate();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  initializeDate(): void {
    const currentYear = new Date().getFullYear();

    this.minSelectDate = new Date(currentYear, new Date().getMonth() - 1, new Date().getDay());
    this.minDate = new Date(currentYear - 1, new Date().getMonth(), new Date().getDay());
    this.maxDate = new Date(Date.now());
  }
  appSubscription: Subscription[] = [];
  searchForm = new UntypedFormGroup({
    dateFrom: new UntypedFormControl(null),
    dateTo: new UntypedFormControl(null, [Validators.required]),
    docNumber: new UntypedFormControl(null),
    progressID: new UntypedFormControl(null),
    baseID: new UntypedFormControl(null),
    processID: new UntypedFormControl(null),
    usedTool: new UntypedFormControl(null)
  });

  progressList: Observable<SSTModel.ProgressSelectList[]> = new Observable();
  baseList: Observable<SSTModel.IBase[]> = new Observable();
  processList: Observable<SSTModel.ProcessList[]> = new Observable();
  toolsUsedList: Observable<SSTModel.ToolsUsedList[]> = new Observable();
  ngOnInit(): void {

    this.initDateValue();
    this.store.dispatch(SSTActions.LoadSelectProgressList({ payload: [] }));
    this.appSubscription.push(
      this.cHomeService.getProgressSelectList().subscribe(data => {
        if (data.length > 0) this.store.dispatch(SSTActions.LoadSelectProgressList({ payload: data }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );
    this.appSubscription.push(
      this.ccreateSSTService.getBaseList().subscribe(data => {
        if (data.length > 0) this.store.dispatch(SSTActions.LoadBaseList({ payload: data }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );
    this.appSubscription.push(
      this.ccreateSSTService.getProcessList().subscribe(data => {
        if (data.length > 0) this.store.dispatch(SSTActions.LoadProcessList({ payload: data }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );
    this.appSubscription.push(
      this.cHomeService.getToolsUsedList().subscribe(data => {
        if (data.length > 0) this.store.dispatch(SSTActions.LoadToolsUsedList({ payload: data }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );


    this.progressList = this.store.select(SSTSelectors.getSelectProgressList);
    this.baseList = this.store.select(SSTSelectors.getBaseList);
    this.processList = this.store.select(SSTSelectors.getProcessList);
    this.toolsUsedList = this.store.select(SSTSelectors.getToolsUsedList);
  }
  getSelectedDate(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const eventval = new Date(event.value);
      this.maxDate = new Date(eventval.getFullYear() + 1, eventval.getMonth(), eventval.getDay());
    } else {
      this.maxDate = new Date(Date.now());
    }
  }

  onClickDate(): void {
    this.initializeDate();
    this.initDateValue();
  }
  toDate(): string | null {
    if (this.searchForm.get("dateTo")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  onSubmit(): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-left',
      showConfirmButton: false,
      timer: 4000
    });
    const Toast2 = Swal.mixin({
      allowOutsideClick: false,
      showConfirmButton: false
    });
    Toast2.fire({
      text: 'ファイルがダウンロードされています。しばらくお待ちください。',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.sstExportVal = this.searchForm.value;
    this.sstExportVal.dateFrom = moment(this.sstExportVal.dateFrom).format('YYYY-MM-DD');
    this.sstExportVal.dateTo = moment(this.sstExportVal.dateTo).format('YYYY-MM-DD');
    this.appSubscription.push(
      this.cHomeService.getExportCSV(this.sstExportVal).subscribe(data => {
        const blob: any = new Blob([data], { type: 'application/octet-stream' });
        Toast.fire({
          icon: 'success',
          text: 'ファイルがダウンロードされました！'
        });

        fileSaver.saveAs(blob, 'sst_file.csv');

      })
    );
  }
  docnumberInput(event: string): void {
    if (event === "") {
      this.searchForm.controls["dateFrom"].enable();
      this.searchForm.controls["dateTo"].enable();
      this.searchForm.controls["baseID"].enable();
      this.searchForm.controls["processID"].enable();
      this.searchForm.controls["usedTool"].enable();
      this.searchForm.controls["progressID"].enable();
    } else {
      this.searchForm.controls["dateFrom"].disable();
      this.searchForm.controls["dateTo"].disable();
      this.searchForm.controls["baseID"].disable();
      this.searchForm.controls["processID"].disable();
      this.searchForm.controls["usedTool"].disable();
      this.searchForm.controls["progressID"].disable();
    }
  }
  initDateValue(): void {
    this.searchForm.controls["dateFrom"].setValue(this.minSelectDate);
    this.searchForm.controls["dateTo"].setValue(this.maxDate);
  }
  resetForm(): void {
    this.searchForm.reset();
    this.initDateValue();
    this.docnumberInput("");
  }
  ngOnDestroy(): void {
    this.appSubscription.forEach(s => s.unsubscribe());
  }
}
