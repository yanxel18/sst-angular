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
import { CCreateSstManualService } from 'src/components/c-create-sst-manual/c-create-sst-manual.service';
import { AppActivityListCreateDialog } from '../activitylist-create-dialog/app-activitylist-create-dialog';
import { AppActivityGroupViewDialog } from '../activitygroup-dialog/app-activitygroup-dialog';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
const formSizeEditActivity: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogMaxWidth: '825px'
};

const formSizeActivityCreate: SSTModel.FormSize = {
  dialogMinWidth: '250px',
  dialogMaxWidth: '825px',
};

const formSizeActivityGroup: SSTModel.FormSize = {
  dialogMinWidth: '320px',
  dialogWidth: '320px',
  dialogMaxWidth: '825px',
};
@Component({
  selector: 'app-activitylist-view',
  providers: [AppService, CCreateSstManualService],
  templateUrl: 'app-activitylist-dialog.html',
  styleUrls: ['../../app/app.component.sass']
})

export class AppActivityListViewDialog implements OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AppActivityListViewDialog>,
    private createSSTService: CCreateSstManualService,
    private store: Store<SSTModel.SSTState>,
    public spinnerBox: HttpErrorMessageboxService,
    private createActivity: MatDialog,
    private editActivity: MatDialog,
    private createActivityGroup: MatDialog,
    private appService: AppService,
    @Inject(MAT_DIALOG_DATA) public data: SSTModel.UserInfo[]
  ) {
    this.activityListRefresh();
  }
  userinfo: SSTModel.UserInfo[] = this.data;
  registerUserInfo: SSTModel.RegisterUserInfo = {};
  displayedColumns: string[] = ['活動内容', '操作'];
  $groupListItem: SSTModel.ActivityListGroup[] = [];
  $ActivityList!: SSTModel.ActivityList[];
  activityForm = new UntypedFormGroup({
    groupList: new UntypedFormControl(null)
  });
  activityListRefresh(): void {
    this.appSubscription.push(
      this.createSSTService.getActivityList().subscribe((data: SSTModel.ActivityList[]) => {
        this.store.dispatch(SSTActions.LoadActivityList({ payload: data }));
      })
    );
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
    this.appSubscription.push(
      this.store.select(SSTSelectors.getActivityList)
        .subscribe((data: SSTModel.ActivityList[]) => {
          if (data.length > 0) {
            const ACTIVITY_DEFAULT_ID = 1;
            const IS_ACTIVE = 1;
            this.$ActivityList = data.filter(x => x.stc_id > ACTIVITY_DEFAULT_ID)
              .filter(c => c.stg_active === IS_ACTIVE);
            if (this.$ActivityList.length > 0) this.activityForm.get('groupList')!.setValue(this.$ActivityList[0].stc_group_id);
          }
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
        this.activityListRefresh();
      }, (error) => {
        this.spinnerBox.add(error);
      })
    )
  }
  appSubscription: Subscription[] = [];
  selectGroup(selectedVal: number): void {
    this.appSubscription.push(
      this.store.select(SSTSelectors.getActivityList)
        .subscribe((data: SSTModel.ActivityList[]) => {
          const ACTIVITY_DEFAULT_ID = 1;
          if (data.length > 0)
            this.$ActivityList = data.filter(x => x.stc_group_id === selectedVal)
              .filter(x => x.stc_id > ACTIVITY_DEFAULT_ID);
        }));
  }
  openDialogCreateActivity(): void {
    const ActivityGroupNameID: number = this.activityForm.get("groupList")?.value;
    let selectedTask!: SSTModel.ActivityListGroup[];
    this.store.select(SSTSelectors.getActivityListGroup)
      .subscribe((data: SSTModel.ActivityListGroup[]) => {
        if (data.length > 0)
          selectedTask = data.filter(x => x.stg_id === ActivityGroupNameID);
      });
    const dialogRef = this.createActivity.open(AppActivityListCreateDialog, {
      minWidth: formSizeActivityCreate.dialogMinWidth,
      maxWidth: formSizeActivityCreate.dialogMaxWidth,
      disableClose: true,
      data: selectedTask[0]
    });
    dialogRef.afterClosed().subscribe(d => {
      this.activityListRefresh();
    });
  }

  openDialogActivityGroup(): void {
    const dialogRef = this.createActivityGroup.open(AppActivityGroupViewDialog, {
      minWidth: formSizeActivityGroup.dialogMinWidth,
      maxWidth: formSizeActivityGroup.dialogMaxWidth,
      width: formSizeActivityGroup.dialogWidth,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(d => {
      this.activityListRefresh();
    });
  }

  openDialogEditActivity(val: SSTModel.ActivityList): void {
    const dialogRef = this.editActivity.open(AppActivityListEditDialog, {
      minWidth: formSizeEditActivity.dialogMinWidth,
      maxWidth: formSizeEditActivity.dialogMaxWidth,
      disableClose: true,
      data: val
    });
    dialogRef.afterClosed().subscribe(d => {
      this.activityListRefresh();
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
