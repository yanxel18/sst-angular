import { AppService } from '../../app/app.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-activitylist-edit',
  providers: [AppService],
  templateUrl: 'app-activitylist-edit-dialog.html',
  styleUrls: ['../../app/app.component.sass']
})
export class AppActivityListEditDialog implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppActivityListEditDialog>,
    private appService: AppService,
    private store: Store<SSTModel.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.ActivityList
  ) { }
  ActivityListData: SSTModel.ActivityList= this.data;
  UpdateActivityData: SSTModel.UpdateActivity = {};

  ngOnInit() {
        this.initializeData();
  }
  appSubscription: Subscription[] = [];
  activityForm = new UntypedFormGroup({
    activitydesc: new UntypedFormControl('', [Validators.required, SpecialCharValidator()]),
  });

   initializeData(): void{
    this.activityForm.controls["activitydesc"].setValue(this.ActivityListData.stc_content_desc);
  }


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
      activityid: this.ActivityListData.stc_id
    }
    Swal.fire({
      title: '修正',
      text: "活動内容を更新しますか？",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appSubscription.push(
          this.appService.postUpdateActivityList(this.UpdateActivityData).subscribe(response => {
            Swal.fire(
              '修正',
              '活動内容を更新しました！',
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
