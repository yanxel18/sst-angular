import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as SSTSelectors from 'src/store/selector/selectors';
import * as Model from '../../store/model/model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HttpErrorMessageboxService } from '../../error-handler/http-error-messagebox.service';
import * as moment from 'moment';
import { MatSelectionList } from '@angular/material/list';
import { CEditReplySstService } from './c-edit-reply-sst.service';
import { CCreateSstManualService } from '../c-create-sst-manual/c-create-sst-manual.service';

@Component({
  selector: 'app-c-edit-reply-sst',
  templateUrl: './c-edit-reply-sst.component.html',
  styleUrls: ['./c-edit-reply-sst.component.sass'],
  providers: [
    CEditReplySstService,
    HttpErrorMessageboxService,
    CCreateSstManualService,
  ],
})
export class CEditReplySstComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private router: Router,
    private store: Store<Model.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    private ceditreplySSTService: CEditReplySstService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  AccessRights!: Model.AccessRights;
  eventval: Model.SSTFilesReply[] | [] | undefined;
  sstFormReplyDefaultValue: Model.SSTReply[] = [];
  sstFormReplySend: Model.SSTFormReply = {};
  sstReplyDefaultValue: Model.SSTReply[] = [];
  appSubscription: Subscription[] = [];
  sstUserInfo: Model.UserInfo[] = [];
  sstFiles: Model.SSTFilesReply[] | undefined = [];
  uploadbuttonEnable: boolean = true;
  file: FileList | undefined | null;
  reasonList!: Observable<Model.ReasonList[]>;
  filenames: Model.SSTAttachment[] | undefined;
  fileUploadForm = new UntypedFormGroup({
    sstfiles: new UntypedFormControl(''),
  });

  Toast = Swal.mixin({
    toast: true,
    position: 'bottom-left',
    showConfirmButton: false,
    timer: 3000,
  });

  onFileSelect(event: Event) {
    const eventval = (event.target as HTMLInputElement).value;

    this.file = (event.target as HTMLInputElement).files;
    this.filenames = [];
    if (this.file!?.length > 0) {
      this.uploadbuttonEnable = false;
    } else {
      this.uploadbuttonEnable = true;
      this.filenames = undefined;
    }

    for (let i: number = 0; i < this.file!.length; i++) {
      this.filenames?.push({
        name: this.file![i]['name'],
        size: Math.round(this.file![i]['size'] / 1000),
      });
    }
    if (this.file!.length > 5) {
      this.spinnerBox.add('??????????????????????????????????????????!');
    }
    this.fileUploadForm.get('sstfiles')!.setValue(this.file);
  }
  calculateSize(fileSizeValue: number | undefined): number | undefined {
    return Math.round(Number(fileSizeValue) / 1000);
  }
  uploadnewfile(): void {
    this.uploadbuttonEnable = true;
    let checkFile = undefined;
    if (this.file!?.length > 0 || this.filenames!?.length > 0) {
      checkFile = this.sstFiles?.filter(
        (x) => x?.sar_filename == this.file![0]['name']
      )[0];
    }
    if (!this.fileUploadForm.valid) {
      this.spinnerBox.add('???????????????????????????????????????????????????');
    } else if (checkFile) {
      this.spinnerBox.add(
        '?????????????????????????????????????????? ????????????????????????????????????????????????????????????'
      );
    } else if (this.sstFiles!?.length >= 5) {
      this.spinnerBox.add(
        '???????????????5???????????????????????????????????????????????? ??????????????????????????????????????????????????? ????????????????????????????????????????????????????????????'
      );
    } else if (this.fileUploadForm.valid) {
      this.uploadbuttonEnable = true;
      const Toast = Swal.mixin({
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      Toast.fire({
        text: '???????????????????????????????????????????????????????????????????????????????????????',
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      if (this.file !== undefined) {
        for (let i = 0; i < this.file!.length; i++) {
          formData.append('sstfiles', this.file![i], this.file![i]['name']);
        }
      }
      formData.append('data', JSON.stringify(this.sstFormReplyDefaultValue));
      this.appSubscription.push(
        this.ceditreplySSTService
          .postUploadReplyFile(
            formData,
            this.sstFormReplyDefaultValue[0].str_reply_rowid
          )
          .subscribe((response) => {
            if (response.result === 'success') {
              this.updateSSTFileReplyList(
                this.sstFormReplyDefaultValue[0].str_reply_rowid
              );
              this.Toast.fire({
                icon: 'success',
                text: '???????????????????????????????????????????????????',
              });
            }
          })
      );
    }
  }
  hideEndDatePicker: Boolean = false;
  ngAfterViewInit (): void {
    if (this.sstFormReplyDefaultValue[0].str_progress_id === 3 &&
      !this.sstFormReplyDefaultValue[0].str_reasonID){
      this.sstFormReply.controls['progressReasonID'].setValidators([
        Validators.required,
      ]);
      this.sstFormReply.controls['progressReasonID'].updateValueAndValidity();
      this.sstFormReply.controls['endDate'].setValidators([
        Validators.required,
      ]);
      this.sstFormReply.controls['endDate'].updateValueAndValidity();
      this.hideEndDatePicker = false;
    }
  }
  progressChange(): void {
    if (this.sstFormReply.get('progressComboID')?.value === 3) {
      this.hideEndDatePicker = false;
      this.resetEnableReasonSelect();
      this.sstFormReply.controls['endDate'].setValidators([
        Validators.required,
      ]);
      this.sstFormReply.controls['endDate'].updateValueAndValidity();
    } else if (this.sstFormReply.get('progressComboID')?.value === 1) {
      this.sstFormReply.controls['endDate'].setValidators([
        Validators.required,
      ]);
      this.sstFormReply.controls['endDate'].updateValueAndValidity();
      this.resetReasonSelect();
    } else {
      this.resetReasonSelect();
      this.sstFormReply.controls['endDate'].setValue('');
      this.hideEndDatePicker = false;
      this.sstFormReply.controls['endDate'].clearValidators();
      this.sstFormReply.controls['endDate'].updateValueAndValidity();
    }
  }

  private resetReasonSelect(): void {
    this.sstFormReply.controls['progressReasonID'].disable();
    this.sstFormReply.controls['progressReasonID'].setValue(null);
  }

  private resetEnableReasonSelect(): void {
    this.sstFormReply.controls['progressReasonID'].enable();
    this.sstFormReply.controls['progressReasonID'].setValidators([
      Validators.required,
    ]);
    this.sstFormReply.controls['progressReasonID'].updateValueAndValidity();
  }
  async ngOnInit(): Promise<void> {
    this.store
      .select(SSTSelectors.getUserInfo)
      .pipe(map((t) => t[0]?.su_access_rights![0]))
      .subscribe((data) => {
        this.AccessRights = data;
      });
    await this.loadDefaultValue();
    await this.initializeData();

    this.disableDateSelect();
  }
  deleteSelectedFile(event: MatSelectionList): void {
    if (event._value!?.length > 0) {
      this.eventval = JSON.parse(JSON.stringify(event._value));

      Swal.fire({
        title: '????????????',
        text: '?????????????????????????????????????????????',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: '?????????',
        cancelButtonColor: '#d33',
        confirmButtonText: '??????',
      }).then((result) => {
        if (result.isConfirmed) {
          this.appSubscription.push(
            this.ceditreplySSTService
              .postDeleteSSTReplyFile(this.eventval)
              .subscribe((data) => {
                if (data.result === 'success') {
                  Swal.fire('??????', '???????????????????????????????????????', 'success');
                  this.updateSSTFileReplyList(
                    this.sstFormReplyDefaultValue[0].str_reply_rowid
                  );
                }
              })
          );
        }
      });
    } else {
      this.spinnerBox.add('??????????????????????????????????????????????????????');
    }
  }
  goBack(): void {
    Swal.fire({
      title: '??????',
      text: '?????????????????????????????????????',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: '?????????',
      cancelButtonColor: '#d33',
      confirmButtonText: '??????',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['sst']);
      }
    });
  }
  progressComboSelect = [
    {
      id: 4,
      name: '?????????',
    },
    {
      id: 3,
      name: '?????????',
    },
    {
      id: 2,
      name: '?????????',
    },
    {
      id: 1,
      name: '??????',
    },
  ];

  disableDateSelect(): boolean {
    if (
      this.sstFormReply.get('progressComboID')?.value === 3 ||
      this.sstFormReply.get('progressComboID')?.value === 4
    ) {
      this.sstFormReply.controls['lunchDate'].setValue('');
      this.sstFormReply.controls['startDate'].setValue('');
      this.sstFormReply.controls['lunchDate'].clearValidators();
      this.sstFormReply.controls['startDate'].clearValidators();
      this.sstFormReply.controls['lunchDate'].updateValueAndValidity();
      this.sstFormReply.controls['startDate'].updateValueAndValidity();
      return true;
    } else {
      this.sstFormReply.controls['lunchDate'].setValidators([
        Validators.required,
      ]);
      this.sstFormReply.controls['startDate'].setValidators([
        Validators.required,
      ]);
      this.sstFormReply.controls['lunchDate'].updateValueAndValidity();
      this.sstFormReply.controls['startDate'].updateValueAndValidity();
      return false;
    }
  }
  events: string[] = [];
  endDate(): void {
    if (this.sstFormReply.get('progressComboID')?.value === 3 ){
      this.sstFormReply.controls['endDate'].setValidators([
        Validators.required,
      ]);
      this.sstFormReply.controls['endDate'].updateValueAndValidity();
    }else{
      this.sstFormReply.controls['progressComboID'].setValue(1);
      this.resetReasonSelect();
    }

  }

  sstFormReply = new UntypedFormGroup({
    usernametxt: new UntypedFormControl(''),
    emailtxt: new UntypedFormControl('', [Validators.required, Validators.email]),
    localNumberTxt: new UntypedFormControl('', [Validators.required]),
    progressComboID: new UntypedFormControl(''),
    progressReasonID: new UntypedFormControl(''),
    lunchDate: new UntypedFormControl(''),
    startDate: new UntypedFormControl(''),
    endDate: new UntypedFormControl(null),
    remarks: new UntypedFormControl(''),
  });
  async loadDefaultValue(): Promise<void> {
    this.reasonList = this.ceditreplySSTService.getReasonList();
    this.appSubscription.push(
      this.store.select(SSTSelectors.getUserInfo).subscribe((data) => {
        this.sstUserInfo = data;
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getSelectedSSTEdit).subscribe((d) => {
        d.length === 0
          ? this.router.navigate(['sst'])
          : (this.sstFormReplyDefaultValue = d);
      })
    );
    if (this.sstFormReplyDefaultValue.length > 0) {
      this.appSubscription.push(
        this.store
          .select(SSTSelectors.getSSTMasterList)
          .pipe(
            map((i) =>
              i?.filter(
                (item) =>
                  item.sst_id === this.sstFormReplyDefaultValue[0].str_sst_id
              )
            )
          )
          .subscribe((d: Model.SSTMasterList[]) => {
            if (d.length > 0) {
              this.sstReplyDefaultValue = d[0].sstreply?.filter(
                (d) =>
                  d.str_reply_rowid ===
                  this.sstFormReplyDefaultValue[0].str_reply_rowid
              );
              this.updateSSTFileReplyList(
                this.sstFormReplyDefaultValue[0].str_reply_rowid
              );
            }
          })
      );
    }
  }

  updateSSTFileReplyList(x: number | undefined): void {
    this.appSubscription.push(
      this.ceditreplySSTService.getSSTFileReplyList(x).subscribe(
        (data) => {
          this.uploadbuttonEnable = true;
          this.filenames = undefined;
          this.sstFiles = data;
        },
        (error) => {
          this.uploadbuttonEnable = false;
          this.spinnerBox.add(error);
        }
      )
    );
  }
  onSubmit(): void {
    this.sstFormReplySend = {
      ...this.sstFormReply.value,
    };
    this.sstFormReplySend.sstid = this.sstFormReplyDefaultValue[0].str_sst_id;
    this.sstFormReplySend.lunchDate = this.disableDateSelect()
      ? undefined
      : moment(this.sstFormReply.get('lunchDate')?.value).format('YYYY-MM-DD');
    this.sstFormReplySend.startDate = this.disableDateSelect()
      ? undefined
      : moment(this.sstFormReply.get('startDate')?.value).format('YYYY-MM-DD');
    this.sstFormReplySend.endDate = this.sstFormReply.get('endDate')?.value
      ? moment(this.sstFormReply.get('endDate')?.value).format('YYYY-MM-DD')
      : null;
    this.sstFormReplySend.gid = this.sstUserInfo[0].su_gid;
    this.sstFormReplySend.rownumber =
      this.sstFormReplyDefaultValue[0].str_reply_rowid;
    if (!this.sstFormReply.valid) {
      return;
    } else this.updateSSTReplyMSGBox();
  }
  updateSSTReplyMSGBox(): void {
    Swal.fire({
      title: 'SST??????',
      text: 'SST?????????????????????????????????????????????',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: '?????????',
      cancelButtonColor: '#d33',
      confirmButtonText: '??????',
    }).then((result) => {
      if (result.isConfirmed) {
        const Toast = Swal.mixin({
          allowOutsideClick: false,
          showConfirmButton: false,
        });
        Toast.fire({
          text: '????????????????????????????????????????????????????????????????????????',
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.appSubscription.push(
          this.ceditreplySSTService
            .postUpdateSSTReply(this.sstFormReplySend)
            .subscribe(() => {
              Swal.fire('??????', 'SST??????????????????????????????', 'success');
              this.router.navigate(['sst']);
            })
        );
      }
    });
  }
  cancelform(): void {
    Swal.fire({
      title: 'SST?????????????????????',
      text: '?????????????????????????????????????',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: '?????????',
      cancelButtonColor: '#d33',
      confirmButtonText: '??????',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['sst']);
      }
    });
  }
  lunchDateErrorMsg(): string | null {
    if (this.sstFormReply.get('lunchDate')?.hasError('required')) {
      return '??????????????????';
    }
    return null;
  }
  endDateErrorMsg(): string | null {
    if (this.sstFormReply.get('endDate')?.hasError('required')) {
      return '??????????????????';
    } else if (this.sstFormReply.get('endDate')?.hasError('required')) {
      return '???????????????????????????????????????';
    }
    return null;
  }
  progressReasonMsg(): string | null {
    if (this.sstFormReply.get('progressReasonID')?.hasError('required')) {
      return '??????????????????';
    }
    return null;
  }
  minDateCompute(): void {
    const startDate = this.sstFormReply.get('startDate')?.value;
    this.currentYear = new Date(startDate);
    this.minDate = new Date(
      this.currentYear.getFullYear(),
      this.currentYear.getMonth(),
      this.currentYear.getDate()
    );
  }
  startendDateErrorMsg2(): string | null {
    if (this.sstFormReply.get('lunchDate')?.hasError('required')) {
      return '??????????????????';
    }
    if (this.sstFormReply.get('startDate')?.hasError('required')) {
      return '??????????????????';
    }
    return null;
  }
  currentYear!: Date;
  minDate!: Date;
  async initializeData(): Promise<void> {
    if (this.sstReplyDefaultValue.length > 0) {
      this.currentYear = new Date(
        this.sstReplyDefaultValue[0].str_schedulestart_date
      );
      this.minDate = new Date(
        this.currentYear.getFullYear(),
        this.currentYear.getMonth(),
        this.currentYear.getDate()
      );
      this.sstFormReply.controls['usernametxt'].setValue(
        this.sstUserInfo[0]?.su_fullname
      );
      this.sstFormReply.controls['emailtxt'].setValue(
        this.sstUserInfo[0]?.su_email
      );
      this.sstFormReply.controls['localNumberTxt'].setValue(
        this.sstUserInfo[0]?.su_local_phone
      );
      this.sstFormReply.controls['progressComboID'].setValue(
        this.sstFormReplyDefaultValue[0]?.str_progress_id
      );
      this.sstFormReply.controls['remarks'].setValue(
        this.sstReplyDefaultValue[0]?.str_remarks
      );
      this.sstFormReply.controls['lunchDate'].setValue(
        this.sstReplyDefaultValue[0]?.str_completed_date
      );
      this.sstFormReply.controls['startDate'].setValue(
        this.sstReplyDefaultValue[0]?.str_schedulestart_date
      );
      this.sstFormReply.controls['endDate'].setValue(
        this.sstReplyDefaultValue[0]?.str_scheduleend_date
      );
      this.sstReplyDefaultValue[0]?.str_reasonID
        ? this.sstFormReply.controls['progressReasonID'].setValue(
            this.sstReplyDefaultValue[0].str_reasonID
          )
        : this.sstFormReply.controls['progressReasonID'].disable();

    }
    if (this.AccessRights?.sar_sst_update === 0) {
      this.sstFormReply.controls['progressComboID'].disable();
      this.sstFormReply.controls['progressReasonID'].disable();
    } else {
      this.sstFormReply.controls['progressComboID'].enable();
      this.sstFormReply.controls['progressReasonID'].enable();
    }
    if (this.sstReplyDefaultValue[0]?.str_progress_id !== 3)
      this.resetReasonSelect();
  }

  ngOnDestroy(): void {
    this.appSubscription.forEach((s) => s.unsubscribe());
  }
}
