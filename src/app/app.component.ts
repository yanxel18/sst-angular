import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import * as SSTModel from '../store/model/model';
import * as SSTActions from 'src/store/actions/actions';
import * as SSTSelectors from 'src/store/selector/selectors';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { HttpErrorHandlerService } from 'src/error-handler/http-error-handler.service';
import { AppBaseView } from '../app-dialog/base-dialog/app-baseview';
import { AppUserPassDialog } from '../app-dialog/pass-dialog/app-passdialog';
import { AppUpdateDialog } from '../app-dialog/userupdate-dialog/app-userupdate';
import { AppUserListDialog } from '../app-dialog/userlist-dialog/app-userlistdialog';
import { AppActivityListViewDialog } from '../app-dialog/activitylist-dialog/app-activitylist-dialog';
import * as fileSaver from 'file-saver';
import Swal from 'sweetalert2';
const formSizeCreateBase: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogMaxWidth: '825px'
};
const formSizeUserPass: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogMaxWidth: '825px',
  dialogMinHeight: '200px',
};
const formSizeRegister: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogWidth: '500px',
  dialogMinHeight: '350px'
};
const formSizeUserManage: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogMaxWidth: '825px'
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers: [AppService, MatDialog]
})
export class AppComponent implements OnDestroy, OnInit {

  mobileQuery: MediaQueryList;
  userSignedIn$: boolean | undefined;
  title = "SST System";
  AccessRights!: SSTModel.AccessRights;
  private MobileQueryListener: () => void;
  userinfo: SSTModel.UserInfo[] = [];
  appSubscription: Subscription[] = [];

  constructor(
    private store: Store<SSTModel.SSTState>,
    changeDetectorRef: ChangeDetectorRef,
    private manageUser: MatDialog,
    private createBase: MatDialog,
    private updateUser: MatDialog,
    private registerUser: MatDialog,
    private activityList: MatDialog,
    httpErrorhandler: HttpErrorHandlerService,
    private router: Router,
    media: MediaMatcher,
    private appService: AppService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.MobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.MobileQueryListener);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  ngOnInit(): void {
    this.initializedState();
  }
  initializedState(): void {
    this.store.select(SSTSelectors.getUserSignIn).subscribe(data => {
      this.userSignedIn$ = data
      this.appService.getUserInfo().subscribe((data: SSTModel.UserInfo[]) => {
        if (data.length > 0) {
          this.store.dispatch(SSTActions.LoadUserInfo({ payload: data }));
          this.store.dispatch(SSTActions.SetUserSignin({ payload: true }));
          this.userinfo = data;
          if (this.userinfo.length > 0) {
            this.appSubscription.push(
              this.store.select(SSTSelectors.getUserInfo).pipe(
                map(t => t[0]?.su_access_rights![0])).subscribe(data => {
                  this.AccessRights = data;
                }));

          }
        }
      });

    });
  }
  openDialogUserManage(): void {
    this.manageUser.open(AppUserListDialog, {
      minWidth: formSizeUserManage.dialogMinWidth,
      width: formSizeUserManage.dialogWidth,
      height: formSizeUserManage.dialogHeight,
      minHeight: formSizeUserManage.dialogMinHeight,
      maxWidth: formSizeUserManage.dialogMaxWidth,
      maxHeight: formSizeUserManage.dialogMaxHeight,
      disableClose: true,
      data: this.userinfo
    });
  }
  openDialogUserUpdate(): void {
    const dialogRef = this.updateUser.open(AppUpdateDialog, {
      minWidth: formSizeRegister.dialogMinWidth,
      width: formSizeRegister.dialogWidth,
      minHeight: formSizeRegister.dialogMinHeight,
      disableClose: true,
      data: this.userinfo[0]
    });

    dialogRef.afterClosed().subscribe(d => {
      this.initializedState();
    });
  }

  openDialogUpdatePass(): void {
    const dialogRef = this.registerUser.open(AppUserPassDialog, {
      minWidth: formSizeUserPass.dialogMinWidth,
      width: formSizeUserPass.dialogWidth,
      minHeight: formSizeUserPass.dialogMinHeight,
      disableClose: true,
      data: this.userinfo[0]
    });

  }
  openDialogCreateBase(): void {
    const dialogRef = this.createBase.open(AppBaseView, {
      minWidth: formSizeCreateBase.dialogMinWidth,
      width: formSizeCreateBase.dialogWidth,
      minHeight: formSizeCreateBase.dialogMinHeight,
      maxWidth: formSizeCreateBase.dialogMaxWidth,
      maxHeight: formSizeCreateBase.dialogMaxHeight,
      disableClose: true,
      data: this.userinfo
    });

    dialogRef.afterClosed().subscribe(d => {
      this.router.navigate(['sst']);
    });

  }

  openDialogActivityList(): void {
    const dialogRef = this.createBase.open(AppActivityListViewDialog, {
      minWidth: formSizeCreateBase.dialogMinWidth,
      width: formSizeCreateBase.dialogWidth,
      minHeight: formSizeCreateBase.dialogMinHeight,
      maxWidth: formSizeCreateBase.dialogMaxWidth,
      maxHeight: formSizeCreateBase.dialogMaxHeight,
      disableClose: true,
      data: this.userinfo
    });

    dialogRef.afterClosed().subscribe(d => {
      this.router.navigate(['sst']);
    });

  }
  downloadFile(): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-left',
      showConfirmButton: false,
      timer: 4000
    });
    const Toast2 = Swal.mixin({
      allowOutsideClick: false,
      showConfirmButton: false
    });
    Toast2.fire({
      text: 'ファイルがダウンロードされています。しばらくお待ちください。',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      }
    });
    const manualFileName = "SST進捗管理システム_操作マニュアル.pptx";
    this.appSubscription.push(
      this.appService.getManual().subscribe(data => {
        const blob: any = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
        Toast.fire({
          icon: 'success',
          text: 'ファイルがダウンロードされました！'
        });

        fileSaver.saveAs(blob, manualFileName);

      })
    );

  }
  logOut(): void {
    this.store.select(SSTSelectors.getUserSignIn).subscribe(data => {
      this.userSignedIn$ = data
    });
    this.appSubscription.push(
      this.appService.postLogout().subscribe((data: SSTModel.DataResult) => {
        if (data.result === "success") {
          this.store.dispatch(SSTActions.LoadUserInfo({ payload: [] }));
          this.store.dispatch(SSTActions.SetUserSignin({ payload: false }));
          sessionStorage.removeItem('SST');
          sessionStorage.removeItem('tablePage');
          sessionStorage.removeItem('_rowSel');
          sessionStorage.removeItem('_scroll');
          this.router.navigate(['sst/login']);
        }
      })
    )
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.MobileQueryListener);
    this.appSubscription.forEach(s => s.unsubscribe());
  }

}

