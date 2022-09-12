import { Component ,OnInit, OnDestroy} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { CLoginService } from './c-login.service';
import * as SSTModel from '../../store/model/model';
import { Router } from '@angular/router';
import { HttpErrorMessageboxService } from '../../error-handler/http-error-messagebox.service';
import { Subscription } from 'rxjs';
import * as SSTActions from 'src/store/actions/actions';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-c-login',
  templateUrl: './c-login.component.html',
  styleUrls: ['./c-login.component.sass'],
  providers: [CLoginService, HttpErrorMessageboxService],
})
export class CLoginComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private cLoginService: CLoginService,
    public msgBoxService: HttpErrorMessageboxService,
    private store: Store<SSTModel.SSTState>
  ) {
    sessionStorage.removeItem('SST');
    this.store.dispatch(SSTActions.SetUserSignin({ payload: false }));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  appSubscription: Subscription[] = [];
  ngOnInit(): void {
  }
  loginform: UntypedFormGroup = new UntypedFormGroup({
    usergid: new UntypedFormControl('',[Validators.required]),
    userpass: new UntypedFormControl('',[Validators.required]),
  });
  hide = true;
  submit() {
    if (this.loginform.valid) {
      this.appSubscription.push(
        this.cLoginService.postLogin(this.loginform.value).subscribe((data: SSTModel.TokenInterface) => {
          if(data.token){
            sessionStorage.removeItem('tablePage');
            sessionStorage.removeItem('_rowSel');
            sessionStorage.removeItem('_scroll');
            sessionStorage.setItem('SST', data.token);
            sessionStorage.setItem('tablePage','0');
            this.store.dispatch(SSTActions.SetUserSignin({ payload: true }));
            this.router.navigate(['sst']);
          }
        })
      )
  }
}
userName(): string | null {
  if (this.loginform.get("usergid")?.hasError('required')) {
    return '空白は禁止！';
  }
  return null;
}

userPass(): string | null {
  if (this.loginform.get("userpass")?.hasError('required')) {
    return '空白は禁止！';
  }
  return null;
}
  ngOnDestroy(): void {
    this.appSubscription.forEach(s => s.unsubscribe());
  }
}
