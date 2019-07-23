import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule,
         MatIconModule,
         MatFormFieldModule,
         MatSnackBarModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTreeModule } from '@angular/material/tree';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { AppComponent } from './app.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { EquityComponent,
         DialogMintingComponent,
         DialogUnmintingComponent,
         DialogTotalSharesComponent,
         DialogPausingComponent,
         DialogUnpausingComponent,
         DialogChangeOwnerComponent,
         DialogClaimPeriodComponent,
         DialogCollateralRateComponent,
         DialogRenounceOwnershipComponent
        } from './equity/equity.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedispenserComponent } from './sharedispenser/sharedispenser.component';
import { ClaimtoolComponent } from './claimtool/claimtool.component';
import { SelectorPanelComponent } from './selector-panel/selector-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    EquityComponent,
    DialogMintingComponent,
    DialogUnmintingComponent,
    DialogTotalSharesComponent,
    DialogPausingComponent,
    DialogUnpausingComponent,
    DialogChangeOwnerComponent,
    DialogClaimPeriodComponent,
    DialogCollateralRateComponent,
    DialogRenounceOwnershipComponent,
    FooterComponent,
    NavigationComponent,
    SharedispenserComponent,
    ClaimtoolComponent,
    SelectorPanelComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    HttpClientModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatIconModule,
    MatMenuModule,
    MatStepperModule,
    MatDividerModule,
    MatExpansionModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    AppRoutingModule,
  ],
  entryComponents: [
    DialogMintingComponent,
    DialogUnmintingComponent,
    DialogTotalSharesComponent,
    DialogPausingComponent,
    DialogUnpausingComponent,
    DialogChangeOwnerComponent,
    DialogClaimPeriodComponent,
    DialogCollateralRateComponent,
    DialogRenounceOwnershipComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
