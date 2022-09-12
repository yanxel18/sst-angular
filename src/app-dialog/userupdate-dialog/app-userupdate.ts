import { AppService } from '../../app/app.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as SSTModel from '../../store/model/model';
import * as SSTActions from 'src/store/actions/actions';
import * as SSTSelectors from 'src/store/selector/selectors';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sst-user-update',
  providers: [AppService],
  templateUrl: './app-userupdate.html',
  styleUrls: ['../../app/app.component.sass']
})
export class AppUpdateDialog implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<AppUpdateDialog>,
    private appService: AppService,
    private store: Store<SSTModel.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.UserInfo
  ) {
    this.initializeData();
  }
  appSubscription: Subscription[] = [];
  userInfo: SSTModel.UserInfo = this.data;
  updateForm!: UntypedFormGroup;
  updateUserInfo: SSTModel.RegisterUserInfo = {};
  $RegisterDropList!: SSTModel.RegistrationDropList;
  $BaseList!: SSTModel.BaseList[];
  ngOnInit() {
    this.appSubscription.push(
      this.appService.getRegistrationList().subscribe((data: SSTModel.RegistrationDropList[]) => {
        if (data.length > 0) {
          this.store.dispatch(SSTActions.LoadRegistrationList({ payload: data[0] }));
          this.appSubscription.push(
            this.store.select(SSTSelectors.getUserInfo).subscribe((data: SSTModel.UserInfo[]) => {
              if (data[0].su_acclvl_id >= 3) {
                this.$BaseList = this.$RegisterDropList.BaseList.filter(s => s.stb_base_id == data[0].su_base_id);
              } else {
                this.$BaseList = this.$RegisterDropList.BaseList;
              }
            })
          );
        }
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getRegistrationDropList)
        .subscribe((data ) => {
          if (data.BaseList.length > 0) {
            this.$RegisterDropList = data;
          }
        }));
  }

  async initializeData(): Promise<void> {
    this.updateForm = await new UntypedFormGroup({
      baseNameID: new UntypedFormControl(this.userInfo.su_base_id, [Validators.required]),
      productionID: new UntypedFormControl(this.userInfo.su_pgroup_id, [Validators.required]),
      gidFull: new UntypedFormControl(this.userInfo.su_gid_full, [Validators.required, Validators.minLength(5), SpecialCharValidator(), noWhitespaceValidator]),
      fullName: new UntypedFormControl(this.userInfo.su_fullname, [Validators.required, Validators.minLength(2), SpecialCharValidator()]),
      emailAdd: new UntypedFormControl(this.userInfo.su_email, [Validators.required, Validators.email]),
      localNumber: new UntypedFormControl(this.userInfo.su_local_phone, [Validators.required, Validators.minLength(6), LocalPhoneCharValidator()]),
      accesslvlID: new UntypedFormControl(this.userInfo.su_acclvl_id, [Validators.required]),
    });

  }

  productionselectErrorMsg(): string | null {
    if (this.updateForm.get("productionID")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }

  accessLevelErrorMsg(): string | null {
    if (this.updateForm.get("accesslvlID")?.hasError('required')) {
      return 'アクセス権を選択してください！';
    }
    return null;
  }
  gIDErrorMsg(): string | null {
    if (this.updateForm.get('gidFull')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.updateForm.get('gidFull')!.hasError('minlength')) {
      return '5文字以上必要です！';
    } else if (this.updateForm.get('gidFull')!.hasError('isCharValid')) {
      return '特殊文字は使用できません！';
    } else if (this.updateForm.get('gidFull')!.hasError('whitespace')) {
      return 'スペースは許可されていません！';
    }
    return null;
  }
  fullNameErrorMsg(): string | null {
    if (this.updateForm.get('fullName')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.updateForm.get('fullName')!.hasError('minlength')) {
      return '5文字以上必要です！';
    } else if (this.updateForm.get('fullName')!.hasError('isCharValid')) {
      return '特殊文字は使用できません！';
    }
    return null;
  }
  emailErrorMsg(): string | null {
    if (this.updateForm.get('emailAdd')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.updateForm.get('emailAdd')!.hasError('email')) {
      return 'メールフォーマットが間違っています！';
    }
    return null;
  }
  localPhoneErrorMsg(): string | null {
    if (this.updateForm.get("localNumber")?.hasError('required')) {
      return '空白は禁止！';
    } else if (this.updateForm.get("localNumber")?.hasError('isCharValid')) {
      return '内線フォーマットが間違っています！';
    } else if ((this.updateForm.get("localNumber")?.value).length < 6) {
      return '6文字以上';
    }
    return null;
  }
  baseselectErrorMsg(): string | null {
    if (this.updateForm.get("baseNameID")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }

  accessselectErrorMsg(): string | null {
    if (this.updateForm.get("accesslvlID")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }

  updateUser(): void {
    if (!this.updateForm.valid) { return }
    this.updateUserInfo = {
      ...this.updateForm.value
    }
    this.updateUserInfo.gid = this.userInfo.su_gid;
    Swal.fire({
      title: 'ユーザー更新',
      text: "アカウントを更新しますか？",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appSubscription.push(
          this.appService.postUpdateUser(this.updateUserInfo).subscribe(response => {
            Swal.fire(
              '更新',
              'アカウントを更新しました。',
              'success'
            );
            this.dialogRef.close();
          })
        )
      }
    })
  }
  closeDialog(): void {
    this.store.dispatch(SSTActions.LoadRegistrationList({ payload: {
      BaseList: [],
      ProcessGroupList: [],
      AccessLevelList: []
    } }));
    this.appSubscription.forEach(s => s.unsubscribe());
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.appSubscription.forEach(s => s.unsubscribe());
  }
}

export function SpecialCharValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const notallowed = /[!#%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const Valid = notallowed.test(control.value);
    return Valid ? { isCharValid: { value: control.value } } : null;
  };
}

export function LocalPhoneCharValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const notallowed = /[!#%^&*()_+\=\[\]{};':`"\\|,.<>\/?^a-z^A-Z]+/;
    const Valid = notallowed.test(control.value);
    return Valid ? { isCharValid: { value: control.value } } : null;
  };
}
export function noWhitespaceValidator(control: UntypedFormControl) {
  if (control.value !== '') {
    const notallowed = /\s/;
    const isValid = !notallowed.test(control.value);
    return isValid ? null : { 'whitespace': true };
  } else {
    return null;
  }
}
export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl!.errors && !checkControl!.errors.matching) {
        return null;
      }

      if (control!.value !== checkControl!.value) {
        controls.get(checkControlName)!.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}
