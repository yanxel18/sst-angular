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
  templateUrl: 'app-activitygroup-edit-dialog.html',
  styleUrls: ['../../app/app.component.sass']
})
export class AppActivityGroupEditDialog implements  OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppActivityGroupEditDialog>,
    private appService: AppService,
    private store: Store<SSTModel.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.ActivityListGroup
  ) { }
  ActivityListData: SSTModel.ActivityListGroup= this.data;
  UpdateActivityGroupData!: SSTModel.updateActivityGroupParam;
　
  appSubscription: Subscription[] = [];
  activityGroupForm = new UntypedFormGroup({
    groupName: new UntypedFormControl(this.ActivityListData.stg_group, [Validators.required, SpecialCharValidator()]),
  });

　


  ActivityErrorMsg(): string | null {
    if (this.activityGroupForm.get('groupName')!.hasError('required')) {
      return '空白は禁止！';
    } else if (this.activityGroupForm.get('groupName')!.hasError('isCharValid')) {
      return '特殊文字は使用できません！';
    } else if (this.activityGroupForm.get('groupName')!.hasError('whitespace')) {
      return 'スペースは許可されていません！';
    }
    return null;
  }

  updateActivity(): void {
    if (!this.activityGroupForm.valid) { return }
    this.UpdateActivityGroupData = {
      ...this.activityGroupForm.value,
      groupID: this.ActivityListData.stg_id
    }
    Swal.fire({
      title: '修正',
      text: "活動グループ名を更新しますか？",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appSubscription.push(
          this.appService.postUpdateActivityGroup(this.UpdateActivityGroupData).subscribe(response => {
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
                '修正',
                '活動グループ修正済み！',
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
