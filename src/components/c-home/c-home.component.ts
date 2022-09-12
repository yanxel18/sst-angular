import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CHomeServiceService } from './c-home-service.service';
import * as SSTActions from 'src/store/actions/actions';
import * as SSTSelectors from 'src/store/selector/selectors';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorMessageboxService } from '../../error-handler/http-error-messagebox.service';
import { SstexportDialogComponent } from './sstexport-dialog/sstexport-dialog.component';
import { Subscription, Observable } from 'rxjs';
import * as Model from '../../store/model/model';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DecimalPipe } from '@angular/common';
import * as fileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
const formCSVExport: Model.FormSize = {
  dialogMinWidth: '350px',
  dialogWidth: '500px',
  dialogMinHeight: '350px',
};

@Component({
  selector: 'app-c-home',
  templateUrl: './c-home.component.html',
  providers: [CHomeServiceService],
  styleUrls: ['./c-home.component.sass'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('SSTTablePaginator', { static: true })
  SSTTablePaginator!: MatPaginator;
  @ViewChild('tablecontainer', { read: ElementRef })
  tablecontainer!: ElementRef<HTMLElement>;
  AccessRights: Observable<Model.AccessRights> = new Observable();
  sstDatSourceArr: Model.SSTMasterList[] = [];
  sstUserInfo!: Model.UserInfo;
  sstDataSource!: MatTableDataSource<Model.SSTMasterList>;
  searchText: string = '';
  sstTableColumnHeader: string[] = [
    'ID',
    '文書番号',
    '登録日時',
    '回答状況',
    '展開案件',
    '活動内容',
    '期待効果',
    '使用ツール',
    '登録拠点',
    '登録工程',
    '登録者',
  ];
  sstTableDataColumn: string[] = [
    'operation',
    'sst_num',
    'sst_doc_number',
    'sst_apply_date',
    'sp_progress_status',
    'sst_deployment_demand',
    'sst_activity_content',
    'sst_expected_effect',
    'sst_tools_used',
    'stb_base_name',
    'sp_process_desc',
    'sst_fullname',
  ];
  sstTableInnerColumnHeader: string[] = [
    '拠点',
    '回答状況',
    '',
    '回答者',
    '着手予定日',
    '完了予定日',
    '完了日',
    '備考',
  ];
  sstTableInnerColumn: string[] = [
    'operation',
    'stb_base_desc',
    'sp_icon',
    'sp_progress_desc',
    'str_created_byname',
    'str_completed_date',
    'str_schedulestart_date',
    'str_scheduleend_date',
    'str_remarks',
  ];
  selectedSST: Model.SSTMasterList[] = [];
  selectedSSTReply: Model.SSTReply[] = [];
  sstexpandedElement!: Model.SSTMasterList | null;
  decimalPipe = new DecimalPipe(navigator.language);
  pageCurrent: number = 0;
  constructor(
    private store: Store<Model.SSTState>,
    private cHomeService: CHomeServiceService,
    private router: Router,
    public spinnerBox: HttpErrorMessageboxService,
    private sstexportdialog: MatDialog
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  appSubscription: Subscription[] = [];
  async ngOnInit(): Promise<void> {
    this.SSTTablePaginator._intl.itemsPerPageLabel = 'ページあたりのアイテム';
    this.SSTTablePaginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} の ${this.decimalPipe.transform(length)}`;
    };
    const currentPage = sessionStorage.getItem('tablePage');

    this.pageCurrent = currentPage ? parseInt(currentPage) : 0;

    await this.loadtoValue();

    this.sstexpandedElement = this.toggleRowShow;
  }
  get toggleRowShow(): Model.SSTMasterList | null {
    const currentRow = sessionStorage.getItem('_rowSel');
    return currentRow ? JSON.parse(currentRow) : null;
  }

  getTablePageNum(event: PageEvent): void {
    sessionStorage.setItem('tablePage', event.pageIndex.toString());
    this.pageCurrent = event.pageIndex;
  }
  setTablePage(): void {
    this.SSTTablePaginator.pageIndex = this.pageCurrent;
    const event: PageEvent = {
      length: this.SSTTablePaginator.length,
      pageIndex: this.SSTTablePaginator.pageIndex,
      pageSize: this.SSTTablePaginator.pageSize,
    };
    this.SSTTablePaginator.page.next(event);
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.sstDataSource.filter = filterValue.trim().toLowerCase();
  }
  clearTextSearch(): void {
    if (this.searchText !== '') {
      this.sstDataSource.filter = '';
      this.searchText = '';
    }
  }
  ngAfterViewInit(): void {
    this.appSubscription.push(
      this.store.select(SSTSelectors.getSSTMasterList).subscribe((data) => {
        if (data?.length > 0) {
          setTimeout(() => {
            this.setTablePage();
            this.applyScroll();
          }, 0);
        }
      })
    );
  }
  
  applyScroll(): void {
    const scrollVal = sessionStorage.getItem('_scroll');
    if (scrollVal)
      this.tablecontainer.nativeElement.scrollTop = parseInt(scrollVal);
  }

  onScroll(): void {
    sessionStorage.setItem(
      '_scroll',
      this.tablecontainer.nativeElement.scrollTop.toString()
    );
  }
  openDialogSSTExport(): void {
    this.sstexportdialog.open(SstexportDialogComponent, {
      minWidth: formCSVExport.dialogMinWidth,
      disableClose: true,
    });
  }
  toggleRow(element: Model.SSTMasterList): void {
    if (element) {
      this.selectedSST = [];
      this.selectedSST.push(element);
      if (this.selectedSST.length > 0) {
        this.store.dispatch(
          SSTActions.SelectSSTEdit({ payload: this.selectedSST })
        );
      }
      sessionStorage.setItem('_rowSel', JSON.stringify(element));
      this.sstexpandedElement =
        this.sstexpandedElement === element ? null : element;
    }
  }

  editSSTReply(val: Model.SSTReply): void {
    this.selectedSSTReply = [];
    this.selectedSSTReply.push(val);
    if (this.selectedSSTReply.length > 0) {
      this.store.dispatch(
        SSTActions.SelectSSTEditReply({ payload: this.selectedSSTReply })
      );
      this.router.navigate(['sst/edit/reply']);
    }
  }
  trimRemarks(val: string): string | null {
    return val?.trim().length > 15 ? val.substring(0, 15) + '...' : val;
  }
  editSST(val: Model.SSTMasterList): void {
    this.selectedSST = [];
    this.selectedSST.push(val);
    if (this.selectedSST.length > 0) {
      this.store.dispatch(
        SSTActions.SelectSSTEdit({ payload: this.selectedSST })
      );
      this.router.navigate(['sst/edit']);
    }
  }

  downloadFile(val: Model.SSTMasterList): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-left',
      showConfirmButton: false,
      timer: 4000,
    });
    const Toast2 = Swal.mixin({
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Toast2.fire({
      text: 'ファイルがダウンロードされています。しばらくお待ちください。',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const x: Model.SSTReply[] = [];
    val.sstreply
      ?.filter((x) => x.str_filecount > 0)
      .map((data) =>
        x.push({
          str_reply_rowid: data.str_reply_rowid,
          stb_base_desc: data.stb_base_desc,
          str_schedulestart_date: data.str_schedulestart_date,
          str_filecount: data.str_filecount,
        })
      );
    this.appSubscription.push(
      this.cHomeService.getFileSST(val.sst_doc_number, x).subscribe((data) => {
        const blob: any = new Blob([data], {
          type: 'application/octet-stream',
        });
        Toast.fire({
          icon: 'success',
          text: 'ファイルがダウンロードされました！',
        });

        fileSaver.saveAs(blob, val.sst_doc_number + '.zip');
      })
    );
  }

  downloadSSTReplyFile(val: Model.SSTReply): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-left',
      showConfirmButton: false,
      timer: 4000,
    });
    const Toast2 = Swal.mixin({
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Toast2.fire({
      text: 'ファイルがダウンロードされています。しばらくお待ちください。',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.appSubscription.push(
      this.cHomeService
        .getFileReplySST(val.str_reply_rowid)
        .subscribe((data) => {
          const blob: any = new Blob([data], {
            type: 'application/octet-stream',
          });

          Toast.fire({
            icon: 'success',
            text: 'ファイルがダウンロードされました！',
          });
          fileSaver.saveAs(blob, val.str_reply_rowid + '.zip');
        })
    );
  }
  deleteSST(val: Model.SSTMasterList): void {
    Swal.fire({
      title: '削除',
      text: '削除をすると復活できませんが宜しいですか？',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'いいえ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '削除',
          text: 'SST文書番号:' + val.sst_doc_number + ' を削除よろしいですか？',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonText: 'いいえ',
          cancelButtonColor: '#d33',
          confirmButtonText: 'はい',
        }).then((result) => {
          if (result.isConfirmed) {
            this.appSubscription.push(
              this.cHomeService.postDeleteSST(val).subscribe(
                () => {
                  Swal.fire('削除', 'SST文書を削除されました。', 'success');
                  this.loadtoValue();
                },
                (error) => {
                  this.spinnerBox.add(error);
                },
                () => {
                  this.spinnerBox.LoadSuccess = false;
                }
              )
            );
          } else {
            Swal.fire('削除', 'SSTの削除はキャンセルされました。', 'success');
          }
        });
      } else {
        Swal.fire('削除', 'SSTの削除はキャンセルされました。', 'success');
      }
    });
  }

  addSST(): void {
    this.router.navigate(['sst/create']);
  }
  async loadtoValue(): Promise<void> {
    this.spinnerBox.LoadSuccess = true;
    this.store.dispatch(SSTActions.SelectSSTEdit({ payload: [] }));
    this.appSubscription.push(
      this.cHomeService.getSSTMasterList().subscribe(
        (data) => {
          if (data.length > 0)
            this.store.dispatch(
              SSTActions.LoadSSTMasterList({ payload: data })
            );
        },
        () => {},
        () => {
          this.spinnerBox.LoadSuccess = false;
        }
      )
    );
    this.AccessRights = this.store
      .select(SSTSelectors.getUserInfo)
      .pipe(map((t) => t[0]?.su_access_rights![0]));

    this.appSubscription.push(
      this.store.select(SSTSelectors.getSSTMasterList).subscribe((data) => {
        if (data?.length > 0) {
          this.sstDatSourceArr = data;
          this.sstDataSource = new MatTableDataSource<Model.SSTMasterList>(
            this.sstDatSourceArr
          );
          this.sstDataSource.paginator = this.SSTTablePaginator;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.appSubscription.forEach((s) => s.unsubscribe());
  }
}
