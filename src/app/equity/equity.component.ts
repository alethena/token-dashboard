import { Component, OnInit, Inject } from '@angular/core';
import { InfuraService } from '../services/infura/infura.service';
import { AleqService } from '../services/aleq/aleq.service';
import { DataService } from '../services/data/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Web3Service } from '../services/metamask/web3.service';
import { MatSnackBar } from '@angular/material';


export interface DialogData {
  mintNumber: number;
}

@Component({
  selector: 'app-equity',
  templateUrl: './equity.component.html',
  styleUrls: ['./equity.component.scss'],
})

export class EquityComponent implements OnInit {
  public pauseStatus = false;
  public nameStatus = 'Loading';
  public symbolStatus = 'Loading';
  public totalSupplyStatus: number;
  public totalSharesStatus: number;
  public termsandconditions = 'Loading';
  public collateralRate: number;
  public preClaimPeriod: number;
  public claimPeriod: number;
  public contractAddress = 'Loading';
  public ownerAddress = 'Loading';
  public masterAddress = 'Loading';
  mintNumber: number;

  constructor(
    private infuraService: InfuraService, 
    private aleqService: AleqService, 
    private dataService: DataService,
     private web3Service: Web3Service,
    public dialog: MatDialog
    ) { }

  async ngOnInit() {
    await this.infuraService.bootstrapWeb3();
    await this.aleqService.bootstrapALEQ();
    this.dataService.pauseStatusObservable.subscribe((newPauseStatus) => {
      this.pauseStatus = newPauseStatus;
    });
    this.dataService.nameStatusObservable.subscribe((newNameStatus) => {
      this.nameStatus = newNameStatus;
    });
    this.dataService.symbolStatusObservable.subscribe((newSymbolStatus) => {
      this.symbolStatus = newSymbolStatus;
    });
    this.dataService.totalSupplyStatusObservable.subscribe((newTotalSupplyStatus) => {
      this.totalSupplyStatus = parseFloat(newTotalSupplyStatus);
    });
    this.dataService.totalSharesStatusObservable.subscribe((newTotalSharesStatus) => {
      this.totalSharesStatus = parseFloat(newTotalSharesStatus);
    });
    this.dataService.termsandconditionsObservable.subscribe((newTermsandConditions) => {
      this.termsandconditions = newTermsandConditions;
    });
    this.dataService.collateralRateObservable.subscribe((newCollateralRate) => {
      this.collateralRate = parseFloat(newCollateralRate);
    });
    this.dataService.preClaimPeriodObservable.subscribe((newPreClaimPeriod) => {
      this.preClaimPeriod = parseFloat(newPreClaimPeriod);
    });
    this.dataService.claimPeriodObservable.subscribe((newClaimPeriod) => {
      this.claimPeriod = parseFloat(newClaimPeriod);
    });
    this.dataService.contractAddressObservable.subscribe((newContractAddress) => {
      this.contractAddress = newContractAddress;
    });
    this.dataService.ownerAddressObservable.subscribe((newOwnerAddress) => {
      this.ownerAddress = newOwnerAddress;
    });
    this.dataService.masterAddressObservable.subscribe((newMasterAddress) => {
      this.masterAddress = newMasterAddress;
    });
  }
  openMintDialog() {
    const dialogRef = this.dialog.open(DialogMintingDialog, {
      width: '500px',
      data: {mintNumber: this.mintNumber}
    });
  }
  openUnmintDialog() {
    const dialogRef = this.dialog.open(DialogUnmintingDialog, {
      width: '500px',
      data: {mintNumber: this.mintNumber}
    });
  }
  openTotalSharesDialog() {
    const dialogRef = this.dialog.open(DialogTotalSharesDialog, {
      width: '500px',
      data: {mintNumber: this.mintNumber}
    });
  }
}

@Component({
  selector: 'dialog-minting',
  templateUrl: 'dialog-minting.html',
  styleUrls: ['./dialog-minting.scss'],
})

export class DialogMintingDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogMintingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-unminting',
  templateUrl: 'dialog-unminting.html',
  styleUrls: ['./dialog-unminting.scss'],
})

export class DialogUnmintingDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogUnmintingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-total-shares',
  templateUrl: 'dialog-total-shares.html',
  styleUrls: ['./dialog-total-shares.scss'],
})

export class DialogTotalSharesDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogTotalSharesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

}