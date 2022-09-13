import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CCreateSstManualService } from './c-create-sst-manual.service';
import * as SSTActions from 'src/store/actions/actions';
import * as SSTSelectors from 'src/store/selector/selectors';
import * as Model from '../../store/model/model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HttpErrorMessageboxService } from '../../error-handler/http-error-messagebox.service';
import * as moment from 'moment';
import { AppService } from 'src/app/app.service';

@Component({
  providers: [CCreateSstManualService],
  selector: 'app-c-create-sst-manual',
  templateUrl: './c-create-sst-manual.component.html',
  styleUrls: ['./c-create-sst-manual.component.sass'],
})
export class CCreateSstManualComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<Model.SSTState>,
    private ccreateSSTService: CCreateSstManualService,
    private router: Router,
    public spinnerBox: HttpErrorMessageboxService,
    private appService: AppService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  AccessRights: Observable<Model.AccessRights> = new Observable();
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput:
    | ElementRef
    | undefined;

  fileInputLabel: FileList | null | undefined;
  spinnerDefault: boolean = true;
  appSubscription: Subscription[] = [];
  myControl = new UntypedFormControl();
  file: FileList | undefined | null;
  filenames: Model.SSTAttachment[] | undefined;

  onFileSelect(event: Event): void {
    const eventval = (event.target as HTMLInputElement).value;
    this.file = (event.target as HTMLInputElement).files;
    this.fileInputLabel = this.file;
    this.filenames = [];

    for (let i: number = 0; i < this.file!.length; i++) {
      this.filenames.push({
        name: this.file![i]['name'],
        size: Math.round(this.file![i]['size'] / 1000),
      });
    }
    if (this.file!.length > 5) {
      this.spinnerBox.add('許容添付ファイルを超えました!');
    }
    //this.fileInputLabel = this.file.name;
    this.sstForm.get('sstfiles')!.setValue(this.file);
  }
  generateDocNumber(): string {
    let dateRand: string = Math.round(Date.now() + Math.random())
      .toString()
      .substring(4, 10);
    let result: string = '';
    const characters: string = 'ABCDEFGH0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return 'SST' + result + dateRand.toString();
  }

  sstFormValue: Model.ISSTForm = {
    applyDate: moment().format('YYYY-MM-DD'),
    lunchDate: null,
    startDate: null,
    endDate: null,
    conditionTxt: '',
    machineListTxt: '',
    processListTxt: '',
    expectedEffectTxt: '',
    awarenessToolListTxt: '',
    analysisToolListTxt: '',
    actionToolListTxt: '',
    resultToolListTxt: '',
    awarenessTxt: '',
    analysisTxt: '',
    actionTxt: '',
    resultTxt: '',
  };

  applyDateDisabled: boolean = true;

  sstForm = new UntypedFormGroup({
    applyDate: new UntypedFormControl(this.sstFormValue.applyDate),
    emailTxt: new UntypedFormControl('', [
      Validators.required,
      Validators.email,
    ]),
    applyUserName: new UntypedFormControl('', [Validators.required]),
    baseListCombo: new UntypedFormControl({ value: this.sstFormValue.baseID }, [
      Validators.required,
    ]), //remove  base value if toggle is enable
    localNumberTxt: new UntypedFormControl(''),
    activityListTxt: new UntypedFormControl('', [Validators.required]),
    lunchDate: new UntypedFormControl(this.sstFormValue.lunchDate, [
      Validators.required,
    ]),
    startDate: new UntypedFormControl(this.sstFormValue.startDate, [
      Validators.required,
    ]),
    endDate: new UntypedFormControl(this.sstFormValue.endDate),
    conditionTxt: new UntypedFormControl(this.sstFormValue.conditionTxt, [
      Validators.required,
    ]),
    machineListTxt: new UntypedFormControl(this.sstFormValue.machineListTxt, [
      Validators.required,
    ]),
    processListTxt: new UntypedFormControl(this.sstFormValue.processListTxt, [
      Validators.required,
    ]),
    expectedEffectTxt: new UntypedFormControl(
      this.sstFormValue.expectedEffectTxt,
      [Validators.required]
    ),
    awarenessToolListTxt: new UntypedFormControl(
      this.sstFormValue.awarenessToolListTxt
    ),
    analysisToolListTxt: new UntypedFormControl(
      this.sstFormValue.analysisToolListTxt
    ),
    actionToolListTxt: new UntypedFormControl(
      this.sstFormValue.actionToolListTxt
    ),
    resultToolListTxt: new UntypedFormControl(
      this.sstFormValue.resultToolListTxt
    ),
    awarenessTxt: new UntypedFormControl(this.sstFormValue.awarenessTxt),
    analysisTxt: new UntypedFormControl(this.sstFormValue.analysisTxt),
    actionTxt: new UntypedFormControl(this.sstFormValue.actionTxt),
    resultTxt: new UntypedFormControl(this.sstFormValue.resultTxt),
    sstfiles: new UntypedFormControl(''),
  });

  $baseOptions!: Observable<Model.IBase[]>;
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
  sstSendData: Model.ISSTForm = {};

  onSubmit(): void {
    this.sstSendData = {
      ...this.sstFormValue,
      ...this.sstForm.value,
    };

    const formData = new FormData();
    if (this.file !== undefined) {
      for (let i = 0; i < this.file!.length; i++) {
        formData.append('sstfiles', this.file![i], this.file![i]['name']);
      }
    }
    this.sstSendData.lunchDate = moment(
      this.sstForm.get('lunchDate')?.value
    ).format('YYYY-MM-DD');
    this.sstSendData.startDate = moment(
      this.sstForm.get('startDate')?.value
    ).format('YYYY-MM-DD');
    this.sstSendData.endDate = this.sstForm.get('endDate')?.value
      ? moment(this.sstForm.get('endDate')?.value).format('YYYY-MM-DD')
      : null;

    this.loadtoValue();
    this.appSubscription.push(
      this.store
        .select(SSTSelectors.getProcessList)
        .pipe(
          map((i) =>
            i?.filter(
              (item) => item.sp_process_desc === this.sstSendData.processListTxt
            )
          )
        )
        .subscribe((d) => {
          d.length > 0
            ? (this.sstSendData.processListID = d[0].sp_process_id)
            : (this.sstSendData.processListID = 0);
        })
    );
    this.appSubscription.push(
      this.store
        .select(SSTSelectors.getMachineList)
        .pipe(
          map((i) =>
            i?.filter(
              (item) =>
                item.sml_machine_desc === this.sstSendData.machineListTxt
            )
          )
        )
        .subscribe((d) => {
          d.length > 0
            ? (this.sstSendData.machineListID = d[0].sml_machine_id)
            : (this.sstSendData.machineListID = 0);
        })
    );

    if (this.sstSendData.awarenessToolListTxt === '')
      this.sstSendData.awarenessToolListTxt = 'ー';
    this.appSubscription.push(
      this.store
        .select(SSTSelectors.getToolsListAwareness)
        .pipe(
          map((i) =>
            i?.filter(
              (item) =>
                item.stl_tool_desc === this.sstSendData.awarenessToolListTxt
            )
          )
        )
        .subscribe((d) => {
          d.length > 0
            ? (this.sstSendData.awarenessToolID = d[0].stl_tool_id)
            : (this.sstSendData.awarenessToolID = 0);
        })
    );

    if (this.sstSendData.analysisToolListTxt === '')
      this.sstSendData.analysisToolListTxt = 'ー';
    this.appSubscription.push(
      this.store
        .select(SSTSelectors.getToolsListAnalysis)
        .pipe(
          map((i) =>
            i?.filter(
              (item) =>
                item.sts_tool_desc === this.sstSendData.analysisToolListTxt
            )
          )
        )
        .subscribe((d) => {
          d.length > 0
            ? (this.sstSendData.analysisToolID = d[0].sts_tool_id)
            : (this.sstSendData.analysisToolID = 0);
        })
    );

    if (this.sstSendData.actionToolListTxt === '')
      this.sstSendData.actionToolListTxt = 'ー';
    this.appSubscription.push(
      this.store
        .select(SSTSelectors.getToolsListAction)
        .pipe(
          map((i) =>
            i?.filter(
              (item) =>
                item.sta_tool_desc === this.sstSendData.actionToolListTxt
            )
          )
        )
        .subscribe((d) => {
          d.length > 0
            ? (this.sstSendData.actionToolID = d[0].sta_tool_id)
            : (this.sstSendData.actionToolID = 0);
        })
    );

    if (this.sstSendData.resultToolListTxt === '')
      this.sstSendData.resultToolListTxt = 'ー';
    this.appSubscription.push(
      this.store
        .select(SSTSelectors.getToolsListResult)
        .pipe(
          map((i) =>
            i?.filter(
              (item) =>
                item.str_tool_desc === this.sstSendData.resultToolListTxt
            )
          )
        )
        .subscribe((d) => {
          d.length > 0
            ? (this.sstSendData.resultToolID = d[0].str_tool_id)
            : (this.sstSendData.resultToolID = 0);
        })
    );

    if (!this.sstForm.valid) {
      return;
    } else if (this.filenames!?.length > 5) {
      this.spinnerBox.add('許容添付ファイルを超えました!');
    } else this.createSSTMSGBox(formData);
  }

  goBack(): void {
    Swal.fire({
      title: '戻る',
      text: 'ホームページへ戻りますか?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['sst']);
      }
    });
  }

  cancelform(): void {
    Swal.fire({
      title: 'SST登録キャンセル',
      text: 'ホームページへ戻りますか？',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['sst']);
      }
    });
  }

  createSSTMSGBox(fdata: FormData): void {
    Swal.fire({
      title: '新規登録',
      text: 'SST内容を作成してよろしいですか？',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい',
    }).then((result) => {
      if (result.isConfirmed) {
        const Toast = Swal.mixin({
          allowOutsideClick: false,
          showConfirmButton: false,
        });
        Toast.fire({
          text: 'データを保存しています。しばらくお待ちください。',
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.sstSendData.documentNumber = this.generateDocNumber();
        fdata.append('data', JSON.stringify(this.sstSendData));
        this.ccreateSSTService.docNumber = this.sstSendData.documentNumber;
        this.appSubscription.push(
          this.ccreateSSTService.postUploadFile(fdata).subscribe(
            (response) => {
              Swal.fire('登録', 'SSTを登録しました。', 'success');
              this.router.navigate(['sst']);
            },
            (error) => {
              this.spinnerBox.add(error);
            },
            () => {
              this.spinnerBox.LoadSuccess = false;
            }
          )
        );
      }
    });
  }
  currentYear!: Date;
  minDate!: Date;
  minDateCompute(): void {
    const startDate = this.sstForm.get('startDate')?.value;
    this.currentYear = new Date(startDate);
    this.minDate = new Date(
      this.currentYear.getFullYear(),
      this.currentYear.getMonth(),
      this.currentYear.getDate()
    );
  }
  emailErrorMsg(): string | null {
    if (this.sstForm.get('emailTxt')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.sstForm.get('emailTxt')!.hasError('email')) {
      return 'メールフォーマットが間違っています！';
    }
    return null;
  }
  localPhoneErrorMsg(): string | null {
    if (this.sstForm.get('localNumberTxt')?.hasError('required')) {
      return '空白は禁止！';
    } else if (this.sstForm.get('localNumberTxt')?.hasError('isCharValid')) {
      return '内線フォーマットが間違っています！';
    } else if ((this.sstForm.get('localNumberTxt')?.value).length < 6) {
      return '6文字以上';
    }
    return null;
  }
  lunchDateErrorMsg(): string | null {
    if (this.sstForm.get('lunchDate')?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  startendDateErrorMsg(): string | null {
    if (this.sstForm.get('startDate')?.hasError('required')) {
      return '日付形式を確認してください！';
    } else if (this.sstForm.get('endDate')?.hasError('required')) {
      return '終了日を選択してください。';
    }
    return null;
  }

  startendDateErrorMsg2(): string | null {
    if (this.sstForm.get('lunchDate')?.hasError('required')) {
      return '空白は禁止！。';
    }
    if (this.sstForm.get('startDate')?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  applyUserName(): string | null {
    if (this.sstForm.get('applyUserName')?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  baseselectErrorMsg(): string | null {
    if (this.sstForm.get('baseListCombo')?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  activitylistErrorMsg(): string | null {
    if (this.sstForm.get('activityListTxt')?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  conditionTxtErrorMsg(): string | null {
    if (this.sstForm.get('conditionTxt')?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  machineListErrorMsg(): string | null {
    if (
      this.sstForm.get('machineListTxt')?.hasError('required') ||
      this.sstForm.get('machineListTxt')?.hasError('whitespace')
    ) {
      return '空白は禁止！';
    }
    return null;
  }
  processListErrorMsg(): string | null {
    if (
      this.sstForm.get('processListTxt')?.hasError('required') ||
      this.sstForm.get('processListTxt')?.hasError('whitespace')
    ) {
      return '空白は禁止！';
    }
    return null;
  }
  expectedEffectErrorMsg(): string | null {
    if (
      this.sstForm.get('expectedEffectTxt')?.hasError('required') ||
      this.sstForm.get('expectedEffectTxt')?.hasError('whitespace')
    ) {
      return '空白は禁止！';
    }
    return null;
  }

  awarenessTxtErrorMsg(): string | null {
    if (
      this.sstForm.get('awarenessToolListTxt')?.hasError('required') ||
      this.sstForm.get('awarenessToolListTxt')?.hasError('whitespace')
    ) {
      return '空白は禁止！';
    }
    return null;
  }

  analysisTxtErrorMsg(): string | null {
    if (
      this.sstForm.get('analysisToolListTxt')?.hasError('required') ||
      this.sstForm.get('analysisToolListTxt')?.hasError('whitespace')
    ) {
      return '空白は禁止！';
    }
    return null;
  }

  actionTxtErrorMsg(): string | null {
    if (
      this.sstForm.get('actionToolListTxt')?.hasError('required') ||
      this.sstForm.get('actionToolListTxt')?.hasError('whitespace')
    ) {
      return '空白は禁止！';
    }
    return null;
  }

  resultTxtErrorMsg(): string | null {
    if (
      this.sstForm.get('resultToolListTxt')?.hasError('required') ||
      this.sstForm.get('resultToolListTxt')?.hasError('whitespace')
    ) {
      return '空白は禁止！';
    }
    return null;
  }
  async ngOnInit(): Promise<void> {
    await this.loadtoValue();
    await this.loadDefault();
    this.$baseOptions = this.store.select(SSTSelectors.getBaseList);
    this.$ActivityList = this.store.select(SSTSelectors.getActivityList);
  }

  private _filterMachine(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.machineOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  private _filterProcess(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.processOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterawareness(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.awarenessOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  private _filteranalysis(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.analysisOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  private _filteraction(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.actionOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterresult(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.resultOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  loadDefault(): void {
    this.appSubscription.push(
      this.appService.getUserInfo().subscribe((data: Model.UserInfo[]) => {
        this.store.dispatch(SSTActions.LoadUserInfo({ payload: data }));
      })
    );
    this.AccessRights = this.store
      .select(SSTSelectors.getUserInfo)
      .pipe(map((t) => t[0]?.su_access_rights![0]));

    this.appSubscription.push(
      this.store.select(SSTSelectors.getUserInfo).subscribe((userInfo) => {
        if (userInfo?.length > 0) {
          this.sstForm.controls['applyUserName'].setValue(null);
          this.sstForm.controls['emailTxt'].setValue(null);
          this.sstForm.controls['localNumberTxt'].setValue(null);
          this.sstForm.controls['baseListCombo'].setValue(null);
          this.sstFormValue.userGID = userInfo[0].su_gid;
          this.sstForm.controls['baseListCombo'].enable();
        }
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getMachineList).subscribe((data) => {
        this.machineOptions = Array.from(
          new Set(data?.map((data) => data.sml_machine_desc))
        );
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getProcessList).subscribe((data) => {
        this.processOptions = Array.from(
          new Set(data?.map((data) => data.sp_process_desc))
        );
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getToolsListAction).subscribe((data) => {
        this.actionOptions = Array.from(
          new Set(data?.map((data) => data.sta_tool_desc))
        );
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getToolsListAnalysis).subscribe((data) => {
        this.analysisOptions = Array.from(
          new Set(data?.map((data) => data.sts_tool_desc))
        );
      })
    );
    this.appSubscription.push(
      this.store
        .select(SSTSelectors.getToolsListAwareness)
        .subscribe((data) => {
          this.awarenessOptions = Array.from(
            new Set(data?.map((data) => data.stl_tool_desc))
          );
        })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getToolsListResult).subscribe((data) => {
        this.resultOptions = Array.from(
          new Set(data?.map((data) => data.str_tool_desc))
        );
      })
    );
    this.machinefilteredOptions = this.sstForm
      .get('machineListTxt')
      ?.valueChanges.pipe(map((value) => this._filterMachine(value)));

    this.processfilteredOptions = this.sstForm
      .get('processListTxt')
      ?.valueChanges.pipe(map((value) => this._filterProcess(value)));

    this.awarenessfilteredOptions = this.sstForm
      .get('awarenessToolListTxt')
      ?.valueChanges.pipe(map((value) => this._filterawareness(value)));

    this.analysisfilteredOptions = this.sstForm
      .get('analysisToolListTxt')
      ?.valueChanges.pipe(map((value) => this._filteranalysis(value)));

    this.actionfilteredOptions = this.sstForm
      .get('actionToolListTxt')
      ?.valueChanges.pipe(map((value) => this._filteraction(value)));

    this.resultfilteredOptions = this.sstForm
      .get('resultToolListTxt')
      ?.valueChanges.pipe(map((value) => this._filterresult(value)));
  }

  loadtoValue(): void {
    this.appSubscription.push(
      this.ccreateSSTService.getBaseList().subscribe(
        (data) => {
          this.store.dispatch(SSTActions.LoadBaseList({ payload: data }));
        },
        () => {},
        () => {
          this.spinnerBox.LoadSuccess = false;
        }
      )
    );
    this.appSubscription.push(
      this.ccreateSSTService.getMachineList().subscribe(
        (data) => {
          this.store.dispatch(SSTActions.LoadMachineList({ payload: data }));
        },
        () => {},
        () => {
          this.spinnerBox.LoadSuccess = false;
        }
      )
    );
    this.appSubscription.push(
      this.ccreateSSTService.getActivityList().subscribe(
        (data) => {
          this.store.dispatch(
            SSTActions.LoadActivityList({
              payload: data.filter((x) => x.stc_id > 1 && x.stg_active === 1),
            })
          );
        },
        () => {},
        () => {
          this.spinnerBox.LoadSuccess = false;
        }
      )
    );
    this.appSubscription.push(
      this.ccreateSSTService.getProcessList().subscribe(
        (data) => {
          this.store.dispatch(SSTActions.LoadProcessList({ payload: data }));
        },
        () => {},
        () => {
          this.spinnerBox.LoadSuccess = false;
        }
      )
    );
    this.appSubscription.push(
      this.ccreateSSTService.getToolsListAction().subscribe(
        (data) => {
          this.store.dispatch(
            SSTActions.LoadToolsListAction({ payload: data })
          );
        },
        () => {},
        () => {
          this.spinnerBox.LoadSuccess = false;
        }
      )
    );
    this.appSubscription.push(
      this.ccreateSSTService.getToolsListAnalysis().subscribe(
        (data) => {
          this.store.dispatch(
            SSTActions.LoadToolsListAnalysis({ payload: data })
          );
        },
        () => {},
        () => {
          this.spinnerBox.LoadSuccess = false;
        }
      )
    );
    this.appSubscription.push(
      this.ccreateSSTService.getToolsListAwareness().subscribe(
        (data) => {
          this.store.dispatch(
            SSTActions.LoadToolsListAwareness({ payload: data })
          );
        },
        () => {},
        () => {
          this.spinnerBox.LoadSuccess = false;
        }
      )
    );
    this.appSubscription.push(
      this.ccreateSSTService.getToolsListResult().subscribe(
        (data) => {
          this.store.dispatch(
            SSTActions.LoadToolsListResult({ payload: data })
          );
        },
        () => {},
        () => {
          this.spinnerBox.LoadSuccess = false;
        }
      )
    );
  }
  ngOnDestroy(): void {
    this.appSubscription.forEach((s) => s.unsubscribe());
  }
}
export function LocalPhoneCharValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const notallowed = /[!#%^&*()_+\=\[\]{};':`"\\|,.<>\/?^a-z^A-Z]+/;
    const Valid = notallowed.test(control.value);
    return Valid ? { isCharValid: { value: control.value } } : null;
  };
}
