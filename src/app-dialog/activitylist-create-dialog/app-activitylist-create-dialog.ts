import { AppService } from '../../app/app.service';
import { Component, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as SSTModel from '../../store/model/model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
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
  selector: 'app-activitylist-create',
  providers: [AppService],
  templateUrl: 'app-activitylist-create-dialog.html',
  styleUrls: ['../../app/app.component.sass']
})
export class AppActivityListCreateDialog implements OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppActivityListCreateDialog>,
    private appService: AppService,
    private store: Store<SSTModel.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.ActivityListGroup
  ) { }

  UpdateActivityData: SSTModel.CreateActivity = {};
  appSubscription: Subscription[] = [];
  activityForm = new UntypedFormGroup({
    activitydesc: new UntypedFormControl('', [Validators.required, SpecialCharValidator()]),
  });

  ActivityErrorMsg(): string | null {
    if (this.activityForm.get('activitydesc')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.activityForm.get('activitydesc')!.hasError('isCharValid')) {
      return '特殊文字は使用できません！';
    } else if (this.activityForm.get('activitydesc')!.hasError('whitespace')) {
      return 'スペースは許可されていません！';
    }
    return null;
  }

  updateActivity(): void {
    if (!this.activityForm.valid) { return }
    this.UpdateActivityData = {
      ...this.activityForm.value,
      groupID: this.data.stg_id
    }
    Swal.fire({
      title: '作成',
      text: "活動内容を作成してよろしいですか？",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appSubscription.push(
          this.appService.postCreateActivityList(this.UpdateActivityData).subscribe(response => {
            Swal.fire(
              '作成',
              '活動内容を作成済み！',
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
