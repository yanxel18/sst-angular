import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CHomeComponent } from 'src/components/c-home/c-home.component';
import { CEditSstComponent } from 'src/components/c-edit-sst/c-edit-sst.component';
import { CLoginComponent } from 'src/components/c-login/c-login.component';
import { CLoginGuard } from 'src/components/c-login/c-login.guard';
import { CEditReplySstComponent } from 'src/components/c-edit-reply-sst/c-edit-reply-sst.component';
import { CCreateSstManualComponent } from 'src/components/c-create-sst-manual/c-create-sst-manual.component';
import { AppPageNotFound } from 'src/app-dialog/file-not-found/404';
const routes: Routes = [
  { path: 'sst', component: CHomeComponent, canActivate: [CLoginGuard] },
  { path: 'sst/login', component: CLoginComponent},
  { path: 'sst/create', component: CCreateSstManualComponent, canActivate: [CLoginGuard]  },
  { path: 'sst/edit', component: CEditSstComponent, canActivate: [CLoginGuard]  },
  { path: 'sst/edit/reply', component: CEditReplySstComponent, canActivate: [CLoginGuard]  },
  { path: 'sst/404', component: AppPageNotFound },
  { path: '**', redirectTo: 'sst/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
