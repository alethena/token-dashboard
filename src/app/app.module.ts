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
import { MatListModule } from '@angular/material/list';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { EquityComponent,
         DialogMintingDialog,
         DialogUnmintingDialog,
         DialogTotalSharesDialog,
         DialogPausing,
         DialogUnpausing } from './equity/equity.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    EquityComponent,
    DialogMintingDialog,
    DialogUnmintingDialog,
    DialogTotalSharesDialog,
    DialogPausing,
    DialogUnpausing,
    FooterComponent,
    NavigationComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
  ],
  entryComponents: [
    DialogMintingDialog,
    DialogUnmintingDialog,
    DialogTotalSharesDialog,
    DialogPausing,
    DialogUnpausing,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }