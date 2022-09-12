import { AppService } from '../../app/app.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as SSTModel from '../../store/model/model';
import * as SSTActions from 'src/store/actions/actions';
import * as SSTSelectors from 'src/store/selector/selectors';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';
import { AppCreateBase } from '../basecreate-dialog/app-createbase';
import { AppEditBase } from '../base-edit-dialog/app-editbase';
const formSizeBaseCreate: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogMaxWidth: '825px'
};
@Component({
  selector: 'app-baseview',
  providers: [AppService],
  templateUrl: './app-baseview.html',
  styleUrls: ['../../app/app.component.sass']
})

export class AppBaseView implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppBaseView>,
    private appService: AppService,
    private store: Store<SSTModel.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    private createBase: MatDialog,
    private editBase: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.UserInfo[]
  ) { }
  userinfo: SSTModel.UserInfo[] = this.data;
  registerUserInfo: SSTModel.RegisterUserInfo = {};
  displayedColumns: string[] = ['拠点','操作'];
  $RegisterDropList!: SSTModel.RegistrationDropList;
  $BaseList: SSTModel.BaseList [] = [];

  ngOnInit() {
      this.baseListRefresh();
  }

  baseListRefresh(): void{
    this.appSubscription.push(
      this.appService.getRegistrationList().subscribe((data: SSTModel.RegistrationDropList[]) => {
        this.store.dispatch(SSTActions.LoadRegistrationList({ payload: data[0] }));
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getRegistrationDropList)
        .subscribe((data: SSTModel.RegistrationDropList) => {
          this.$RegisterDropList = data;
          this.$BaseList = data.BaseList;　
        }));

  }
  appSubscription: Subscription[] = [];

  openDialogCreateBase(): void {
    const dialogRef = this.createBase.open(AppCreateBase, {
      minWidth: formSizeBaseCreate.dialogMinWidth,
      width: formSizeBaseCreate.dialogWidth,
      minHeight: formSizeBaseCreate.dialogMinHeight,
      maxWidth: formSizeBaseCreate.dialogMaxWidth,
      maxHeight: formSizeBaseCreate.dialogMaxHeight,
      disableClose: true,
      data: this.userinfo
    });
    dialogRef.afterClosed().subscribe(d=>{
      this.baseListRefresh();
    });
  }
  openDialogEditBase(val: SSTModel.BaseList): void {
    const dialogRef = this.editBase.open(AppEditBase, {
      minWidth: formSizeBaseCreate.dialogMinWidth,
      width: formSizeBaseCreate.dialogWidth,
      minHeight: formSizeBaseCreate.dialogMinHeight,
      maxWidth: formSizeBaseCreate.dialogMaxWidth,
      maxHeight: formSizeBaseCreate.dialogMaxHeight,
      disableClose: true,
      data: val
    });

    dialogRef.afterClosed().subscribe(d=>{
      this.baseListRefresh();
    });
  }
  closeDialog(): void {
    this.appSubscription.forEach(s => s.unsubscribe());
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.appSubscription.forEach(s => s.unsubscribe());
  }
}
