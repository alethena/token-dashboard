import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquityComponent } from '../app/equity/equity.component';
import { SharedispenserComponent } from '../app/sharedispenser/sharedispenser.component';
import { ClaimtoolComponent } from '../app/claimtool/claimtool.component';

const routes: Routes = [
  { path: '', redirectTo: '/equity', pathMatch: 'full' },
  { path: 'equity', component: EquityComponent },
  { path: 'sharedispenser', component: SharedispenserComponent },
  { path: 'claim', component: ClaimtoolComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: true, useHash: true })],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
