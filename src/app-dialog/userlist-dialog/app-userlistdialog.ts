import { AppService } from '../../app/app.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as SSTModel from '../../store/model/model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppRegisterDialog } from '../register-dialog/app-registerdialog';
import { AppUserPassDialog } from '../pass-dialog/app-passdialog';
import { AppUpdateDialog } from '../userupdate-dialog/app-userupdate';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';
import Swal from 'sweetalert2';
const formSizeRegister: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogWidth: '500px',
  dialogMinHeight: '350px'
};

const formSizeUserPass: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogMaxWidth: '825px',
  dialogMinHeight: '200px',
};

@Component({
  selector: 'app-sst-user-list',
  providers: [AppService],
  templateUrl: './app-userlistdialog.html',
  styleUrls: ['../../app/app.component.sass']
})
export class AppUserListDialog implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppUserListDialog>,
    private appService: AppService,
    public spinnerBox: HttpErrorMessageboxService,
    private registerUser: MatDialog,
    private updateUser: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.UserInfo[]
  ) { }
  userinfoCopy: SSTModel.UserInfo[] = [];
  userinfo: SSTModel.UserInfo[] = this.data;
  appSubscription: Subscription[] = [];
  userlist!: SSTModel.UserInfo[];
  ngOnInit() {
    this.loadUserList();
  }
  search(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toString().toLowerCase().trim();
    let t = this.userlist.filter((d) => {
      return ((d.su_fullname?.toLowerCase())!.indexOf(filterValue) >= 0 ||
      (d.stb_base_desc?.toLowerCase())!.indexOf(filterValue) >= 0) ?  true : false;
    });
     (t.length > 0) ? this.userlist = t :this.userlist = this.userinfoCopy;
      if (filterValue == "") this.userlist = this.userinfoCopy;;
  }

  loadUserList(): void {
    this.appSubscription.push(
      this.appService.getUserList().subscribe((data: SSTModel.UserInfo[]) => {
        this.userlist = data;
        this.userinfoCopy = this.userlist;
      })
    )
  }

  deleteAccount(t: SSTModel.UserInfo): void {
    Swal.fire({
      title: 'ユーザー削除',
      text: "アカウント「" + t.su_fullname + "」を削除してよろしいですか？",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appSubscription.push(
          this.appService.getDeleteAccount(t.su_gid).subscribe(response => {
            Swal.fire(
              '削除',
              'アカウントを削除しました。',
              'success'
            );
            this.loadUserList();
          }))
      }
    });
  }
  openDialogRegister(): void {
    const dialogRef = this.registerUser.open(AppRegisterDialog, {
      minWidth: formSizeRegister.dialogMinWidth,
      width: formSizeRegister.dialogWidth,
      minHeight: formSizeRegister.dialogMinHeight,
      disableClose: true,
      data: this.userinfo
    });

    dialogRef.afterClosed().subscribe(d => {
      this.loadUserList();
    });
  }

  openDialogUpdatePass(t: SSTModel.UserInfo): void {
    const dialogRef = this.registerUser.open(AppUserPassDialog, {
      minWidth: formSizeUserPass.dialogMinWidth,
      width: formSizeUserPass.dialogWidth,
      minHeight: formSizeUserPass.dialogMinHeight,
      disableClose: true,
      data: t
    });

  }
  openDialogUserUpdate(t: SSTModel.UserInfo): void {
    const dialogRef = this.updateUser.open(AppUpdateDialog, {
      minWidth: formSizeRegister.dialogMinWidth,
      width: formSizeRegister.dialogWidth,
      minHeight: formSizeRegister.dialogMinHeight,
      disableClose: true,
      data: t
    });

    dialogRef.afterClosed().subscribe(d => {
      this.loadUserList();
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
