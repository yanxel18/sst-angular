import { AppService } from '../../app/app.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as SSTModel from '../../store/model/model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sst-userpass-update',
  providers: [AppService],
  templateUrl: './app-passdialog.html',
  styleUrls: ['../../app/app.component.sass']
})
export class AppUserPassDialog implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppUserPassDialog>,
    private appService: AppService,
    public spinnerBox: HttpErrorMessageboxService,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.UserInfo
  ) { }
  userInfo: SSTModel.UserInfo = this.data;
  registerUserInfo: SSTModel.RegisterUserInfo = {};
  $RegisterDropList!: SSTModel.RegistrationDropList;
  ngOnInit() {

  }
  appSubscription: Subscription[] = [];
  registerForm = new UntypedFormGroup({
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
    this.registerUserInfo.gid = this.userInfo.su_gid;
    Swal.fire({
      title: 'パスワード変更',
      text: "パスワードを変更しますか？",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appSubscription.push(
          this.appService.postUpdatePass(this.registerUserInfo).subscribe(response => {
            Swal.fire(
              '変更',
              'アカウントのパスワードを変更されました！',
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
    const notallowed = /[!#%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;
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
