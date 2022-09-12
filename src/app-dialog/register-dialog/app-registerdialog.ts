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
  selector: 'app-sst-user-reg',
  providers: [AppService],
  templateUrl: './app-registerdialog.html',
  styleUrls: ['../../app/app.component.sass']
})
export class AppRegisterDialog implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppRegisterDialog>,
    private appService: AppService,
    private store: Store<SSTModel.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.UserInfo[]
  ) { }
  appSubscription: Subscription[] = [];
  userInfo: SSTModel.UserInfo[] = this.data;
  registerUserInfo: SSTModel.RegisterUserInfo = {};
  $RegisterDropList!: SSTModel.RegistrationDropList;
  $BaseList!: SSTModel.BaseList[];
  ngOnInit() {
    this.appSubscription.push(
      this.appService.getRegistrationList().subscribe((data: SSTModel.RegistrationDropList[]) => {
        this.store.dispatch(SSTActions.LoadRegistrationList({ payload: data[0] }));
        this.appSubscription.push(
          this.store.select(SSTSelectors.getUserInfo).subscribe(data => {
            if (data[0].su_acclvl_id >= 3) {
              this.$BaseList = this.$RegisterDropList.BaseList.filter(s => s.stb_base_id == data[0].su_base_id);
            } else {
              this.$BaseList = this.$RegisterDropList.BaseList;
            }
          })
        );
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getRegistrationDropList)
        .subscribe((data: SSTModel.RegistrationDropList) => {
          if (data.BaseList.length > 0) {
            this.$RegisterDropList = data;
          }
        }));

  }

  registerForm = new UntypedFormGroup({
    baseNameID: new UntypedFormControl('', [Validators.required]),
    productionID: new UntypedFormControl('', [Validators.required]),
    gidFull: new UntypedFormControl('', [Validators.required, Validators.minLength(5), SpecialCharValidator(), noWhitespaceValidator]),
    fullName: new UntypedFormControl('', [Validators.required, Validators.minLength(2), SpecialCharValidator()]),
    emailAdd: new UntypedFormControl('', [Validators.required, Validators.email]),
    localNumber: new UntypedFormControl('', [Validators.required, Validators.minLength(6), LocalPhoneCharValidator()]),
    accesslvlID: new UntypedFormControl('', [Validators.required]),
    passwordA: new UntypedFormControl('', [Validators.required, Validators.minLength(5), SpecialCharValidator(), noWhitespaceValidator]),
    passwordB: new UntypedFormControl('', [Validators.required, Validators.minLength(5), SpecialCharValidator(), noWhitespaceValidator]),
  }, {
    validators: [Validation.match('passwordA', 'passwordB')]
  });
  checkPasswords(control: UntypedFormControl) {

    const pass: string = this.registerForm.get("passwordA")?.value;
    const confirmPass: string = this.registerForm.get("passwordB")?.value;
    const Valid: boolean = (pass === confirmPass);
    return Valid ? { valid: { value: control.value } } : null;


  }

  productionselectErrorMsg(): string | null {
    if (this.registerForm.get("productionID")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }

  accessLevelErrorMsg(): string | null {
    if (this.registerForm.get("accesslvlID")?.hasError('required')) {
      return 'アクセス権を選択してください！';
    }
    return null;
  }
  gIDErrorMsg(): string | null {
    if (this.registerForm.get('gidFull')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.registerForm.get('gidFull')!.hasError('minlength')) {
      return '5文字以上必要です！';
    } else if (this.registerForm.get('gidFull')!.hasError('isCharValid')) {
      return '特殊文字は使用できません！';
    } else if (this.registerForm.get('gidFull')!.hasError('whitespace')) {
      return 'スペースは許可されていません！';
    }
    return null;
  }
  fullNameErrorMsg(): string | null {
    if (this.registerForm.get('fullName')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.registerForm.get('fullName')!.hasError('minlength')) {
      return '5文字以上必要です！';
    } else if (this.registerForm.get('fullName')!.hasError('isCharValid')) {
      return '特殊文字は使用できません！';
    }
    return null;
  }
  emailErrorMsg(): string | null {
    if (this.registerForm.get('emailAdd')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.registerForm.get('emailAdd')!.hasError('email')) {
      return 'メールフォーマットが間違っています！';
    }
    return null;
  }
  localPhoneErrorMsg(): string | null {
    if (this.registerForm.get("localNumber")?.hasError('required')) {
      return '空白は禁止！';
    }else if (this.registerForm.get("localNumber")?.hasError('isCharValid')) {
      return '内線フォーマットが間違っています！';
    }else if ((this.registerForm.get("localNumber")?.value).length < 6) {
      return '6文字以上';
    }
    return null;
  }
  baseselectErrorMsg(): string | null {
    if (this.registerForm.get("baseNameID")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }

  accessselectErrorMsg(): string | null {
    if (this.registerForm.get("accesslvlID")?.hasError('required')) {
      return '空白は禁止！';
    }
    return null;
  }
  passwordAErrorMsg(): string | null {
    if (this.registerForm.get('passwordA')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.registerForm.get('passwordA')!.hasError('minlength')) {
      return '5文字以上必要です！';
    } else if (this.registerForm.get('passwordA')!.hasError('isCharValid')) {
      return '特殊文字は使用できません！';
    } else if (this.registerForm.get('passwordA')!.hasError('whitespace')) {
      return 'スペースは許可されていません！';
    }
    return null;
  }
  passwordBErrorMsg(): string | null {
    if (this.registerForm.get('passwordB')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.registerForm.get('passwordB')!.hasError('minlength')) {
      return '5文字以上必要です！';
    } else if (this.registerForm.get('passwordB')!.hasError('isCharValid')) {
      return '特殊文字は使用できません！';
    } else if (this.registerForm.get('passwordB')!.hasError('whitespace')) {
      return 'スペースは許可されていません！';
    } else if (this.registerForm.get('passwordB')!.hasError('matching')) {
      return 'パスワードは同じではありません！！';
    }
    return null;
  }


  registerUser(): void {
    if (!this.registerForm.valid) { return }
    this.registerUserInfo = {
      ...this.registerForm.value
    }
    this.registerUserInfo.gid = this.userInfo[0].su_gid;
    Swal.fire({
      title: 'ユーザー登録',
      text: "新アカウントを登録しますか？",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appSubscription.push(
          this.appService.postRegisterUser(this.registerUserInfo).subscribe(response => {
            Swal.fire(
              '登録',
              'アカウントを登録しました。',
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


