import { HttpErrorMessageboxService } from './../error-handler/http-error-messagebox.service';
import { HttpErrorHandlerService } from './../error-handler/http-error-handler.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material-module';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppUpdateDialog } from '../app-dialog/userupdate-dialog/app-userupdate';
import { AppUserPassDialog } from '../app-dialog/pass-dialog/app-passdialog';
import { AppUserListDialog } from '../app-dialog/userlist-dialog/app-userlistdialog';
import { AppBaseView } from '../app-dialog/base-dialog/app-baseview';
import { AppRegisterDialog } from '../app-dialog/register-dialog/app-registerdialog';
import { AppCreateBase } from '../app-dialog/basecreate-dialog/app-createbase';
import { AppPageNotFound } from '../app-dialog/file-not-found/404';
import { AppEditBase } from '../app-dialog/base-edit-dialog/app-editbase';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { reducer } from 'src/store/reducers/reducer';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { LOCALE_ID } from '@angular/core';
import { CHomeServiceService } from 'src/components/c-home/c-home-service.service';
import { CHomeComponent } from '../components/c-home/c-home.component';
import { CEditSstComponent } from '../components/c-edit-sst/c-edit-sst.component';
import { CEditSstService } from 'src/components/c-edit-sst/c-edit-sst.service';
import { CLoginComponent } from '../components/c-login/c-login.component';
import { CLoginService } from 'src/components/c-login/c-login.service';
import { JwtModule } from '@auth0/angular-jwt';
import { CLoginGuard } from 'src/components/c-login/c-login.guard';
import { AppService } from './app.service';
import localeJa from '@angular/common/locales/ja';
import { registerLocaleData } from '@angular/common';
import { CEditReplySstComponent } from '../components/c-edit-reply-sst/c-edit-reply-sst.component';
import { CEditReplySstService } from 'src/components/c-edit-reply-sst/c-edit-reply-sst.service';
import { CCreateSstManualComponent } from '../components/c-create-sst-manual/c-create-sst-manual.component';
import { CCreateSstManualService } from 'src/components/c-create-sst-manual/c-create-sst-manual.service';
import { SstexportDialogComponent } from '../components/c-home/sstexport-dialog/sstexport-dialog.component';
import { AppActivityListViewDialog } from '../app-dialog/activitylist-dialog/app-activitylist-dialog';
import { AppActivityListEditDialog } from '../app-dialog/activitylist-edit-dialog/app-activitylist-edit-dialog';
import { AppActivityListCreateDialog } from '../app-dialog/activitylist-create-dialog/app-activitylist-create-dialog';
import { AppActivityGroupCreateDialog } from 'src/app-dialog/activitygroup-create-dialog/app-activitygroup-create-dialog';
import { AppActivityGroupViewDialog } from 'src/app-dialog/activitygroup-dialog/app-activitygroup-dialog';
import { AppActivityGroupEditDialog } from 'src/app-dialog/activitygroup-edit-dialog/app-activitygroup-edit-dialog';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
export function tokenGetter(): string | null {
  return sessionStorage.getItem('SST');
}
registerLocaleData(localeJa);
@NgModule({
  declarations: [
    AppComponent,
    AppRegisterDialog,
    AppUserListDialog,
    AppUpdateDialog,
    AppUserPassDialog,
    AppActivityListViewDialog,
    AppActivityListEditDialog,
    AppActivityListCreateDialog,
    AppActivityGroupCreateDialog,
    AppActivityGroupViewDialog,
    AppActivityGroupEditDialog,
    AppCreateBase,
    AppBaseView,
    AppEditBase,
    AppPageNotFound,
    CHomeComponent,
    CEditSstComponent,
    CLoginComponent,
    CEditReplySstComponent,
    CCreateSstManualComponent,
    SstexportDialogComponent
  ],
  imports: [
    BrowserModule,
    NgxTrimDirectiveModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSkeletonLoaderModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['172.21.20.90:3000','172.31.12.206:3000']
      }
    }),
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    StoreModule.forRoot({ SSTState: reducer}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    HttpErrorHandlerService,
    HttpErrorMessageboxService,
    CCreateSstManualService,
    CHomeServiceService,
    CEditSstService,
    CLoginService,
    CLoginGuard,
    AppService,
    CEditReplySstService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: LOCALE_ID, useValue: "ja-JP" }
],
bootstrap: [AppComponent]
})


export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));

