import { AppService } from '../../app/app.service';
import { Component, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';
import Swal from 'sweetalert2';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

export function SpecialCharValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const notallowed = /[!#%^&*()_+\-=\[\]{};':\\|,.<>\/?]+/;
    const Valid = notallowed.test(control.value);
    return Valid ? { isCharValid: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-activitygroup-create',
  providers: [AppService],
  templateUrl: 'app-activitygroup-create-dialog.html',
  styleUrls: ['../../app/app.component.sass']
})
export class AppActivityGroupCreateDialog implements OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppActivityGroupCreateDialog>,
    private appService: AppService,
    public spinnerBox: HttpErrorMessageboxService,
  ) { }


  appSubscription: Subscription[] = [];
  activityForm = new UntypedFormGroup({
    groupName: new UntypedFormControl('', [Validators.required, SpecialCharValidator()]),
  });

  ActivityErrorMsg(): string | null {
    if (this.activityForm.get('groupName')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.activityForm.get('groupName')!.hasError('isCharValid')) {
      return '特殊文字は使用できません！';
    } else if (this.activityForm.get('groupName')!.hasError('whitespace')) {
      return 'スペースは許可されていません！';
    }
    return null;
  }


  updateActivity(): void {
    if (!this.activityForm.valid) { return }

    Swal.fire({
      title: '作成',
      text: "新活動グループ名を作成してよろしいですか？",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appSubscription.push(
          this.appService.postCreateActivityGroup(this.activityForm.value).subscribe(response => {
            if(response) {
              if (response[0].existing === "true"){
                Swal.fire(
                  'エラー',
                  '活動グループ名は既存です！',
                  'error'
                );
              }　
            }else{
              Swal.fire(
                '作成',
                '活動グループ作成済み！',
                'success'
              );
              this.dialogRef.close();
            }
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
