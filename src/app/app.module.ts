import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule,
         MatIconModule,
         MatFormFieldModule,
         MatSnackBarModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
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
    MatDividerModule,
    MatExpansionModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
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
