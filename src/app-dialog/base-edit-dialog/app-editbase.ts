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
  templateUrl: './app-editbase.html',
  styleUrls: ['../../app/app.component.sass']
})
export class AppEditBase implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppEditBase>,
    private appService: AppService,
    private store: Store<SSTModel.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.BaseList
  ) { }
  baseData: SSTModel.BaseList= this.data;
  baseInfo: SSTModel.UpdateBase = {};
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
        this.initializeData();
  }
  appSubscription: Subscription[] = [];
  baseForm = new UntypedFormGroup({
    prodID: new UntypedFormControl('', [Validators.required]),
    basename: new UntypedFormControl('', [Validators.required, Validators.minLength(2), SpecialCharValidator()]),
  });

   initializeData(): void{
    this.baseForm.controls["basename"].setValue(this.baseData.stb_base_desc);
    this.baseForm.controls["prodID"].setValue(this.baseData.stg_pgroup_id);
  }
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
      baseID: this.baseData.stb_base_id,
      ...this.baseForm.value
    }
    Swal.fire({
      title: '拠点修正',
      text: "拠点情報を更新しますか？",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appSubscription.push(
          this.appService.postUpdateBase(this.baseInfo).subscribe(response => {
            Swal.fire(
              '修正',
              '拠点情報を更新しました！',
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
