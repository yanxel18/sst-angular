import { AppService } from '../../app/app.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as SSTModel from '../../store/model/model';
import * as SSTActions from 'src/store/actions/actions';
import * as SSTSelectors from 'src/store/selector/selectors';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';
import { AppActivityListEditDialog } from '../activitylist-edit-dialog/app-activitylist-edit-dialog';
import { AppActivityGroupCreateDialog } from '../activitygroup-create-dialog/app-activitygroup-create-dialog';
import { AppActivityGroupEditDialog } from '../activitygroup-edit-dialog/app-activitygroup-edit-dialog';
import { CCreateSstManualService } from 'src/components/c-create-sst-manual/c-create-sst-manual.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
const formSizeEditActivityGroup: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogMaxWidth: '825px'
};

const formSizeActivityCreate: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogMaxWidth: '825px',
};

const formSizeActivityGroupCreate: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogMaxWidth: '825px',
};
@Component({
  selector: 'app-activitylist-view',
  providers: [AppService, CCreateSstManualService],
  templateUrl: 'app-activitygroup-dialog.html',
  styleUrls: ['../../app/app.component.sass']
})

export class AppActivityGroupViewDialog implements OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppActivityGroupViewDialog>,
    private createSSTService: CCreateSstManualService,
    private store: Store<SSTModel.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    private createActivity: MatDialog,
    private editActivity: MatDialog,
    private createActivityGroup: MatDialog,
    private appService: AppService,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.UserInfo[]
  ) {
    this.activityGroupListRefresh();
  }
  userinfo: SSTModel.UserInfo[] = this.data;
  registerUserInfo: SSTModel.RegisterUserInfo = {};
  displayedColumns: string[] = ['活動グループ名', '操作'];
  $groupListItem: SSTModel.ActivityListGroup[] = [];
  activityForm = new UntypedFormGroup({
    groupList: new UntypedFormControl(null)
  });
  activityGroupListRefresh(): void {
    this.appSubscription.push(
      this.createSSTService.getActivityListGroup().subscribe((data: SSTModel.ActivityListGroup[]) => {
        this.store.dispatch(SSTActions.LoadActivityListGroup({ payload: data }));
      })
    );
    this.appSubscription.push(
      this.store.select(SSTSelectors.getActivityListGroup)
        .subscribe((data: SSTModel.ActivityListGroup[]) => {
          if (data.length > 0) this.$groupListItem = data;
        }));

  }

  enableActivityList(): void {
    const groupIDVal: SSTModel.enableActivityList = {
      groupID: this.activityForm.get("groupList")?.value
    }
    this.appSubscription.push(
      this.appService.enableActivityList(groupIDVal).subscribe(response => {
        Swal.fire(
          '活動リスト',
          '活動内容リストを変更済み！',
          'success'
        );
        this.activityGroupListRefresh();
      }, (error) => {
        this.spinnerBox.add(error);
      })
    )
  }
  appSubscription: Subscription[] = [];

  openDialogCreateActivityGroup(): void {
    const dialogRef = this.createActivityGroup.open(AppActivityGroupCreateDialog, {
      minWidth: formSizeActivityGroupCreate.dialogMinWidth,
      maxWidth: formSizeActivityGroupCreate.dialogMaxWidth,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(d => {
      this.activityGroupListRefresh();
    });
  }

  openDialogEditActivityGroup(val: SSTModel.ActivityListGroup): void {
    const dialogRef = this.editActivity.open(AppActivityGroupEditDialog, {
      minWidth: formSizeEditActivityGroup.dialogMinWidth,
      maxWidth: formSizeEditActivityGroup.dialogMaxWidth,
      disableClose: true,
      data: val
    });
    dialogRef.afterClosed().subscribe(d => {
      this.activityGroupListRefresh();
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
