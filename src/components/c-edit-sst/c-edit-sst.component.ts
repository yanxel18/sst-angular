import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as SSTActions from 'src/store/actions/actions';
import * as SSTSelectors from 'src/store/selector/selectors';
import * as Model from '../../store/model/model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HttpErrorMessageboxService } from '../../error-handler/http-error-messagebox.service';
import * as moment from 'moment';
import { CEditSstService } from './c-edit-sst.service';
import { CCreateSstManualService } from '../c-create-sst-manual/c-create-sst-manual.service';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-c-edit-sst',
  templateUrl: './c-edit-sst.component.html',
  styleUrls: ['./c-edit-sst.component.sass'],
  providers: [CEditSstService, CCreateSstManualService, HttpErrorMessageboxService],
})
export class CEditSstComponent implements OnInit, OnDestroy {

  applyDateDisabled: boolean = true;
  sstFormValue!: Model.ISSTForm;
  sstForm!: UntypedFormGroup;
  sstFiles: Model.SSTFiles[] | undefined = [];

  constructor(
    private router: Router,
    private store: Store<Model.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    private ccreateSSTService: CCreateSstManualService,
    private ceditSSTService: CEditSstService
  ) {
    this.loadDefaultValue();
    this.initializeData();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  AccessRights!: Model.AccessRights;
  eventval: Model.SSTFiles[] | [] | undefined
  appSubscription: Subscription[] = [];
  sstFormDefaultValue: Model.SSTMasterList[] = [];
  userInfo: Model.UserInfo[] = [];
  $baseOptions: Observable<Model.IBase[] | [] | undefined> | undefined;
  $ActivityList!: Observable<Model.ActivityList[]>;
  machinefilteredOptions: Observable<string[]> | undefined;
  processfilteredOptions: Observable<string[]> | undefined;
  awarenessfilteredOptions: Observable<string[]> | undefined;
  analysisfilteredOptions: Observable<string[]> | undefined;
  actionfilteredOptions: Observable<string[]> | undefined;
  resultfilteredOptions: Observable<string[]> | undefined;

  machineOptions: string[] = [];
  processOptions: string[] = [];
  awarenessOptions: string[] = [];
  analysisOptions: string[] = [];
  actionOptions: string[] = [];
  resultOptions: string[] = [];
  currentYear!: Date;
  minDate!: Date;
  sstSendData: Model.ISSTForm = {};
  uploadbuttonEnable: boolean = true;
  file: FileList | undefined | null;
  filenames: Model.SSTAttachment[] | undefined;
  fileUploadForm = new UntypedFormGroup({
    sstfiles: new UntypedFormControl(''),
  });

  Toast = Swal.mixin({
    toast: true,
    position: 'bottom-left',
    showConfirmButton: false,
    timer: 3000
  });
  onFileSelect(event: Event) {
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
        size: Math.round(this.file![i]['size'] / 1000)
      });
    }
    if (this.file!.length > 5) {
      this.spinnerBox.add("許容添付ファイルを超えました!");
    }
    this.fileUploadForm.get('sstfiles')!.setValue(this.file);
  }

  emailErrorMessage(): string | null {
    if (this.sstForm.get('emailTxt')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.sstForm.get('emailTxt')!.hasError('email')) {
      return 'メールフォーマットが間違っています！';
    }
    return null;
  }
  lunchDateErrorMsg(): string | null {
    if (this.sstForm.get("lunchDate")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  startendDateErrorMsg(): string | null {
    if (this.sstForm.get("startDate")?.hasError('required')) {
      return '空白は禁止！';
    } else if (this.sstForm.get("endDate")?.hasError('required')) {
      return '終了日を選択してください。';
    }
    return null;
  }
  startendDateErrorMsg2(): string | null {
    if (this.sstForm.get("lunchDate")?.hasError('required')) {
      return '空白は禁止！。';
    } if (this.sstForm.get("startDate")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  activitylistErrorMsg(): string | null {
    if (this.sstForm.get("activityListTxt")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  conditionTxtErrorMsg(): string | null {
    if (this.sstForm.get("conditionTxt")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }

  machineListErrorMsg(): string | null {
    if (this.sstForm.get("machineListTxt")?.hasError('required') ||
      this.sstForm.get("machineListTxt")?.hasError('whitespace')) {
      return '空白は禁止！';
    }
    return null;
  }
  processListErrorMsg(): string | null {
    if (this.sstForm.get("processListTxt")?.hasError('required') ||
      this.sstForm.get("processListTxt")?.hasError('whitespace')) {
      return '空白は禁止！';
    }
    return null;
  }
  activityContentErrorMsg(): string | null {
    if (this.sstForm.get("activityContentTxt")?.hasError('required') ||
      this.sstForm.get("activityContentTxt")?.hasError('whitespace')) {
      return '空白は禁止！';
    }
    return null;
  }
  expectedEffectErrorMsg(): string | null {
    if (this.sstForm.get("expectedEffectTxt")?.hasError('required') ||
      this.sstForm.get("expectedEffectTxt")?.hasError('whitespace')) {
      return '空白は禁止！';
    }
    return null;
  }

  awarenessTxtErrorMsg(): string | null {
    if (this.sstForm.get("awarenessToolListTxt")?.hasError('required') ||
      this.sstForm.get("awarenessToolListTxt")?.hasError('whitespace')) {
      return '空白は禁止！';
    }
    return null;
  }

  analysisTxtErrorMsg(): string | null {
    if (this.sstForm.get("analysisToolListTxt")?.hasError('required') ||
      this.sstForm.get("analysisToolListTxt")?.hasError('whitespace')) {
      return '空白は禁止！';
    }
    return null;
  }

  actionTxtErrorMsg(): string | null {
    if (this.sstForm.get("actionToolListTxt")?.hasError('required') ||
      this.sstForm.get("actionToolListTxt")?.hasError('whitespace')) {
      return '空白は禁止！';
    }
    return null;
  }
  applyUserName(): string | null {
    if (this.sstForm.get("applyUserName")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  resultTxtErrorMsg(): string | null {
    if (this.sstForm.get("resultToolListTxt")?.hasError('required') ||
      this.sstForm.get("resultToolListTxt")?.hasError('whitespace')) {
      return '空白は禁止！';
    }
    return null;
  }
  ngOnInit(): void {
    this.store.select(SSTSelectors.getUserInfo).pipe(
      map(t => t[0]?.su_access_rights![0])).subscribe(data => {
        this.AccessRights = data;
      });

    this.loadtoValue();
    this.loadDefault();
    this.$baseOptions = this.store.select(SSTSelectors.getBaseList);
    this.$ActivityList = this.store.select(SSTSelectors.getActivityList);
    this.sstFiles = this.sstFormDefaultValue[0]?.sstfiles;
  }
  minDateCompute(): void {
    const startDate = this.sstForm.get("startDate")?.value;
    this.currentYear = new Date(startDate);
    this.minDate = new Date(this.currentYear.getFullYear(), this.currentYear.getMonth(), this.currentYear.getDate());
  }
  loadDefaultValue(): void {
    this.appSubscription.push(
      this.store.select(SSTSelectors.getSelectedSST).subscribe(d => {
        if (d.length === 0) {
          this.router.navigate(['sst']);
        } else {
          this.sstFormDefaultValue = d;
          this.currentYear = new Date(this.sstFormDefaultValue[0].sst_schedulestart_date);
          this.minDate = new Date(this.currentYear.getFullYear(), this.currentYear.getMonth(), this.currentYear.getDate());
        }
      })
    );
  }
  generateDocNumber(): string {
    let dateRand: string = Math.round(Date.now() + Math.random()).toString().substring(4, 10);
    let result: string = '';
    const characters: string = 'ABCDEFGH0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return 'SST' + result + dateRand.toString();
  }

  initializeData(): void {

    this.sstFormValue = {
      sstid: this.sstFormDefaultValue[0]?.sst_id,
      documentNumber: this.sstFormDefaultValue[0]?.sst_doc_number, //create document generator number
      applyDate: this.sstFormDefaultValue[0]?.sst_apply_date, //default value datenow
      userFullName: this.sstFormDefaultValue[0]?.sst_fullname, //login default fullname
      userGID: this.sstFormDefaultValue[0]?.sst_gid,
      baseID: this.sstFormDefaultValue[0]?.sst_base_id, //login user default base id
      emailTxt: this.sstFormDefaultValue[0]?.sst_email, //login user default email,
      localNumberTxt: this.sstFormDefaultValue[0]?.sst_local_phone,
      activityListTxt: this.sstFormDefaultValue[0]?.sst_activity_content_id,
      lunchDate: this.sstFormDefaultValue[0]?.sst_completed_date,
      startDate: this.sstFormDefaultValue[0]?.sst_schedulestart_date,
      endDate: this.sstFormDefaultValue[0]?.sst_scheduleend_date,
      conditionTxt: this.sstFormDefaultValue[0]?.sst_deployment_demand,
      machineListTxt: this.sstFormDefaultValue[0]?.sml_machine_desc,
      processListTxt: this.sstFormDefaultValue[0]?.sp_process_desc,
      expectedEffectTxt: this.sstFormDefaultValue[0]?.sst_expected_effect,
      awarenessToolListTxt: this.sstFormDefaultValue[0]?.stl_awarenesstool,
      analysisToolListTxt: this.sstFormDefaultValue[0]?.sts_analysistool,
      actionToolListTxt: this.sstFormDefaultValue[0]?.sta_actiontool,
      resultToolListTxt: this.sstFormDefaultValue[0]?.str_resulttool,
      awarenessTxt: this.sstFormDefaultValue[0]?.sst_awareness_content,
      analysisTxt: this.sstFormDefaultValue[0]?.sst_analysis_content,
      actionTxt: this.sstFormDefaultValue[0]?.sst_action_content,
      resultTxt: this.sstFormDefaultValue[0]?.sst_result_content,
    }

    this.sstForm = new UntypedFormGroup({
      applyDate: new UntypedFormControl(new Date(this.sstFormValue.applyDate ? this.sstFormValue.applyDate : '')),
      emailTxt: new UntypedFormControl(this.sstFormValue.emailTxt, [Validators.required, Validators.email]),
      applyUserName: new UntypedFormControl(this.sstFormValue.userFullName, [Validators.required]),
      baseListCombo: new UntypedFormControl({ value: this.sstFormValue.baseID, disabled: true }),
      localNumberTxt: new UntypedFormControl(this.sstFormValue.localNumberTxt),
      activityListTxt: new UntypedFormControl(this.sstFormValue.activityListTxt, [Validators.required]),
      lunchDate: new UntypedFormControl(this.sstFormValue.lunchDate, [Validators.required]),
      startDate: new UntypedFormControl(this.sstFormValue.startDate, [Validators.required]),
      endDate: new UntypedFormControl(this.sstFormValue.endDate),
      conditionTxt: new UntypedFormControl(this.sstFormValue.conditionTxt, [Validators.required]),
      machineListTxt: new UntypedFormControl(this.sstFormValue.machineListTxt, [Validators.required]),
      processListTxt: new UntypedFormControl(this.sstFormValue.processListTxt, [Validators.required]),
      expectedEffectTxt: new UntypedFormControl(this.sstFormValue.expectedEffectTxt, [Validators.required]),
      awarenessToolListTxt: new UntypedFormControl(this.sstFormValue.awarenessToolListTxt),
      analysisToolListTxt: new UntypedFormControl(this.sstFormValue.analysisToolListTxt),
      actionToolListTxt: new UntypedFormControl(this.sstFormValue.actionToolListTxt),
      resultToolListTxt: new UntypedFormControl(this.sstFormValue.resultToolListTxt),
      awarenessTxt: new UntypedFormControl(this.sstFormValue.awarenessTxt),
      analysisTxt: new UntypedFormControl(this.sstFormValue.analysisTxt),
      actionTxt: new UntypedFormControl(this.sstFormValue.actionTxt),
      resultTxt: new UntypedFormControl(this.sstFormValue.resultTxt)
    });
  }


  private _filterMachine(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.machineOptions.filter(option => option.toLowerCase().includes(filterValue));

  }
  private _filterProcess(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.processOptions.filter(option => option.toLowerCase().includes(filterValue));

  }

  private _filterawareness(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.awarenessOptions.filter(option => option.toLowerCase().includes(filterValue));

  }
  private _filteranalysis(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.analysisOptions.filter(option => option.toLowerCase().includes(filterValue));

  }
  private _filteraction(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.actionOptions.filter(option => option.toLowerCase().includes(filterValue));

  }

  private _filterresult(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.resultOptions.filter(option => option.toLowerCase().includes(filterValue));

  }
  onSubmit(): void {
    this.sstSendData = {
      ...this.sstFormValue,
      ...this.sstForm.value
    }
    this.sstSendData.lunchDate = moment(this.sstForm.get("lunchDate")?.value).format('YYYY-MM-DD');
    this.sstSendData.startDate = moment(this.sstForm.get("startDate")?.value).format('YYYY-MM-DD');
    this.sstSendData.endDate = this.sstForm.get("endDate")?.value ? moment(this.sstForm.get("endDate")?.value).format('YYYY-MM-DD') : null;
    this.loadtoValue();

    const editSSTStorage = sessionStorage.getItem('create_sst')
    if (editSSTStorage) {
      this.userInfo = JSON.parse(editSSTStorage);
      this.sstSendData.modifiedbygid = (this.userInfo[0].su_gid);
    }
    this.appSubscription.push(
      this.store.select(SSTSelectors.getProcessList).pipe(
        map(i => i?.filter(item => item.sp_process_desc === this.sstSendData.processListTxt))
      ).subscribe(d => {
        d.length > 0 ? this.sstSendData.processListID = d[0].sp_process_id :
          this.sstSendData.processListID = 0;
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getMachineList).pipe(
        map(i => i?.filter(item => item.sml_machine_desc === this.sstSendData.machineListTxt))
      ).subscribe(d => {
        d.length > 0 ? this.sstSendData.machineListID = d[0].sml_machine_id :
          this.sstSendData.machineListID = 0;
      })
    );

    if (this.sstSendData.awarenessToolListTxt === "") this.sstSendData.awarenessToolListTxt = 'ー';
    this.appSubscription.push(
      this.store.select(SSTSelectors.getToolsListAwareness).pipe(
        map(i => i?.filter(item => item.stl_tool_desc === this.sstSendData.awarenessToolListTxt))
      ).subscribe(d => {
        d.length > 0 ? this.sstSendData.awarenessToolID = d[0].stl_tool_id :
          this.sstSendData.awarenessToolID = 0;
      })
    );

    if (this.sstSendData.analysisToolListTxt === "") this.sstSendData.analysisToolListTxt = 'ー';
    this.appSubscription.push(
      this.store.select(SSTSelectors.getToolsListAnalysis).pipe(
        map(i => i?.filter(item => item.sts_tool_desc === this.sstSendData.analysisToolListTxt))
      ).subscribe(d => {
        d.length > 0 ? this.sstSendData.analysisToolID = d[0].sts_tool_id :
          this.sstSendData.analysisToolID = 0;
      })
    );

    if (this.sstSendData.actionToolListTxt === "") this.sstSendData.actionToolListTxt = 'ー';
    this.appSubscription.push(
      this.store.select(SSTSelectors.getToolsListAction).pipe(
        map(i => i?.filter(item => item.sta_tool_desc === this.sstSendData.actionToolListTxt))
      ).subscribe(d => {
        d.length > 0 ? this.sstSendData.actionToolID = d[0].sta_tool_id :
          this.sstSendData.actionToolID = 0;
      })
    );

    if (this.sstSendData.resultToolListTxt === "") this.sstSendData.resultToolListTxt = 'ー';
    this.appSubscription.push(
      this.store.select(SSTSelectors.getToolsListResult).pipe(
        map(i => i?.filter(item => item.str_tool_desc === this.sstSendData.resultToolListTxt))
      ).subscribe(d => {
        d.length > 0 ? this.sstSendData.resultToolID = d[0].str_tool_id :
          this.sstSendData.resultToolID = 0;
      })
    );
    if (!this.sstForm.valid) {
      return;
    } else this.updateSSTMSGBox();

  }

  updateSSTMSGBox(): void {
    Swal.fire({
      title: 'SST更新内容',
      text: "SST内容を更新してよろしいですか？",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        const Toast = Swal.mixin({
          allowOutsideClick: false,
          showConfirmButton: false
        });
        Toast.fire({
          text: 'データを保存しています。しばらくお待ちください。',
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
          }
        });
        this.appSubscription.push(
          this.ceditSSTService.postUpdateSST(this.sstSendData)
            .subscribe(() => {
              Swal.fire(
                '更新',
                'SST内容を更新しました。',
                'success'
              );
              this.router.navigate(['sst']);
            }));
      }
    })
  }

  deleteSelectedFile(event: MatSelectionList): void {
    if (event._value!?.length > 0) {
      this.eventval = JSON.parse(JSON.stringify(event._value));
      Swal.fire({
        title: 'ファイル',
        text: "ファイルを削除よろしいですか？",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'いいえ',
        cancelButtonColor: '#d33',
        confirmButtonText: 'はい'
      }).then((result) => {
        if (result.isConfirmed) {
          this.appSubscription.push(
            this.ceditSSTService.postDeleteSSTFile(this.eventval)
              .subscribe((data) => {
                if (data.result === 'success') {
                  Swal.fire(
                    '削除',
                    'ファイルを削除されました。',
                    'success'
                  );
                  this.updateSSTFileList(this.sstFormDefaultValue[0]?.sst_id);
                }
              }));
        }
      })

    } else {
      this.spinnerBox.add("削除するファイルを選択してください！");
    }
  }

  uploadnewfile(): void {
    this.uploadbuttonEnable = true;
    let checkFile = undefined;
    if (this.file!?.length > 0 || this.filenames!?.length > 0) {
      checkFile = this.sstFiles?.filter(x => x?.sa_filename == this.file![0]['name'])[0];
    }
    if (!this.fileUploadForm.valid) {
      this.spinnerBox.add("最初にファイルを添付してください。");
    } else if (checkFile) {
      this.spinnerBox.add("ファイルはすでに存在します！ 最初に既存のファイルを削除してください。");
    } else if (this.sstFiles!?.length >= 5) {
      this.spinnerBox.add("すでに最大5つの添付ファイルを超えています！ 最初にファイルを削除してください。 追加のファイルはアップロードできません。");
    } else if (this.fileUploadForm.valid) {
      this.uploadbuttonEnable = true;
      const Toast = Swal.mixin({
        allowOutsideClick: false,
        showConfirmButton: false
      });
      Toast.fire({
        text: 'ファイルをアップロードしています。しばらくお待ちください。',
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
        }
      });
      const formData = new FormData();
      if (this.file !== undefined) {
        for (let i = 0; i < this.file!.length; i++) {
          formData.append("sstfiles", this.file![i], this.file![i]['name']);
        }
      }
      formData.append("data", JSON.stringify(this.sstFormDefaultValue));
      this.appSubscription.push(
        this.ceditSSTService.postUploadFile(formData, this.sstFormDefaultValue[0]?.sst_doc_number).subscribe(response => {
          if (response.result === 'success') {
            this.updateSSTFileList(this.sstFormDefaultValue[0]?.sst_id);
            this.Toast.fire({
              icon: 'success',
              text: 'ファイルがアップロードされました！'
            });
          }

        })
      );
    }
  }

  updateSSTFileList(x: number | undefined): void {
    this.appSubscription.push(
      this.ceditSSTService.getSSTFileList(x).subscribe(data => {
        this.uploadbuttonEnable = true;
        this.filenames = undefined;
        this.sstFiles = data;
      }, (error) => {
        this.spinnerBox.add(error);
      }));
  }

  goBack(): void {
    Swal.fire({
      title: '戻る',
      text: "ホームページへ戻りますか?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['sst']);
      }
    })
  }

  cancelform(): void {
    Swal.fire({
      title: 'SST修正キャンセル',
      text: "ホームページへ戻りますか?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['sst']);
      }
    })
  }
  loadDefault(): void {
    this.appSubscription.push(
      this.store.select(SSTSelectors.getMachineList).subscribe(data => {
        this.machineOptions = Array.from(new Set(data?.map(data => data.sml_machine_desc)));
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getProcessList).subscribe(data => {
        this.processOptions = Array.from(new Set(data?.map(data => data.sp_process_desc)));
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getToolsListAction).subscribe(data => {
        this.actionOptions = Array.from(new Set(data?.map(data => data.sta_tool_desc)));
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getToolsListAnalysis).subscribe(data => {
        this.analysisOptions = Array.from(new Set(data?.map(data => data.sts_tool_desc)));
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getToolsListAwareness).subscribe(data => {
        this.awarenessOptions = Array.from(new Set(data?.map(data => data.stl_tool_desc)));
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getToolsListResult).subscribe(data => {
        this.resultOptions = Array.from(new Set(data?.map(data => data.str_tool_desc)));
      })
    );
    this.machinefilteredOptions = this.sstForm.get("machineListTxt")?.valueChanges.pipe(
      map(value => this._filterMachine(value))
    );

    this.processfilteredOptions = this.sstForm.get("processListTxt")?.valueChanges.pipe(
      map(value => this._filterProcess(value))
    );

    this.awarenessfilteredOptions = this.sstForm.get("awarenessToolListTxt")?.valueChanges.pipe(
      map(value => this._filterawareness(value))
    );

    this.analysisfilteredOptions = this.sstForm.get("analysisToolListTxt")?.valueChanges.pipe(
      map(value => this._filteranalysis(value))
    );

    this.actionfilteredOptions = this.sstForm.get("actionToolListTxt")?.valueChanges.pipe(
      map(value => this._filteraction(value))
    );

    this.resultfilteredOptions = this.sstForm.get("resultToolListTxt")?.valueChanges.pipe(
      map(value => this._filterresult(value))
    );

  }
  calculateSize(val: number | undefined): number | undefined {
    return Math.round(Number(val) / 1000);
  }
  loadtoValue(): void {


    this.appSubscription.push(
      this.ccreateSSTService.getBaseList().subscribe(data => {
        this.store.dispatch(SSTActions.LoadBaseList({ payload: data }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );
    this.appSubscription.push(
      this.ccreateSSTService.getMachineList().subscribe(data => {
        this.store.dispatch(SSTActions.LoadMachineList({ payload: data }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );
    this.appSubscription.push(
      this.ccreateSSTService.getActivityListonEdit(this.sstFormValue.activityListTxt).subscribe(data => {
        this.store.dispatch(SSTActions.LoadActivityList({ payload: data.filter(x => x.stc_id > 1) }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );
    this.appSubscription.push(
      this.ccreateSSTService.getProcessList().subscribe(data => {
        this.store.dispatch(SSTActions.LoadProcessList({ payload: data }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );
    this.appSubscription.push(
      this.ccreateSSTService.getToolsListAction().subscribe(data => {
        this.store.dispatch(SSTActions.LoadToolsListAction({ payload: data }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );
    this.appSubscription.push(
      this.ccreateSSTService.getToolsListAnalysis().subscribe(data => {
        this.store.dispatch(SSTActions.LoadToolsListAnalysis({ payload: data }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );
    this.appSubscription.push(
      this.ccreateSSTService.getToolsListAwareness().subscribe(data => {
        this.store.dispatch(SSTActions.LoadToolsListAwareness({ payload: data }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );
    this.appSubscription.push(
      this.ccreateSSTService.getToolsListResult().subscribe(data => {
        this.store.dispatch(SSTActions.LoadToolsListResult({ payload: data }));
      }, () => { }, () => {
        this.spinnerBox.LoadSuccess = false;
      })
    );
  }
  ngOnDestroy(): void {
    this.appSubscription.forEach(s => s.unsubscribe());
  }
}
