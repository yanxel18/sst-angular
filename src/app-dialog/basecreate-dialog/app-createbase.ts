import { AppService } from '../../app/app.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as SSTModel from '../../store/model/model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';
import Swal from 'sweetalert2';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as SSTActions from 'src/store/actions/actions';
import * as SSTSelectors from 'src/store/selector/selectors';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

export function SpecialCharValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const notallowed = /[!#%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const Valid = notallowed.test(control.value);
    return Valid ? { isCharValid: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-sst-create-base',
  providers: [AppService],
  templateUrl: './app-createbase.html',
  styleUrls: ['../../app/app.component.sass']
})
export class AppCreateBase implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppCreateBase>,
    private appService: AppService,
    private store: Store<SSTModel.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.UserInfo[]
  ) { }
  userInfo: SSTModel.UserInfo[] = this.data;
  baseInfo: SSTModel.CreateBase = {};
  $RegisterDropList: SSTModel.RegistrationDropList = {
    BaseList: [],
    ProcessGroupList: [],
    AccessLevelList: []
  };
  ngOnInit() {
    this.appSubscription.push(
      this.appService.getRegistrationList().subscribe((data: SSTModel.RegistrationDropList[]) => {
        this.store.dispatch(SSTActions.LoadRegistrationList({ payload: data[0] }));
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getRegistrationDropList)
        .subscribe((data: SSTModel.RegistrationDropList) => {
          this.$RegisterDropList = data;
        }));

  }
  appSubscription: Subscription[] = [];
  baseForm = new UntypedFormGroup({
    prodID: new UntypedFormControl('', [Validators.required]),
    basename: new UntypedFormControl('', [Validators.required, Validators.minLength(2), SpecialCharValidator()]),
  });

  productionselectErrorMsg(): string | null {
    if (this.baseForm.get("prodID")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }

  baseErrorMsg(): string | null {
    if (this.baseForm.get('basename')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.baseForm.get('basename')!.hasError('minlength')) {
      return '5文字以上必要です！';
    } else if (this.baseForm.get('basename')!.hasError('isCharValid')) {
      return '特殊文字は使用できません！';
    } else if (this.baseForm.get('basename')!.hasError('whitespace')) {
      return 'スペースは許可されていません！';
    }
    return null;
  }

  createBase(): void {
    if (!this.baseForm.valid) { return }
    this.baseInfo = {
      ...this.baseForm.value
    }
    this.baseInfo.createdbygid = this.userInfo[0].su_gid;
    Swal.fire({
      title: '拠点登録',
      text: "拠点を登録しますか？",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appSubscription.push(
          this.appService.postCreateBase(this.baseInfo).subscribe(response => {
            Swal.fire(
              '登録',
              '拠点を登録しました！',
              'success'
            );
            this.dialogRef.close();
          }, (error) => {
            this.spinnerBox.add(error);
          })
        )
      }
    })
  }
  closeDialog(): void {
    this.appSubscription.forEach(s => s.unsubscribe());
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.appSubscription.forEach(s => s.unsubscribe());
  }
}
