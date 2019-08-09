import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: false, useHash: false })],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
