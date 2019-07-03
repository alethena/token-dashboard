import { Component, OnInit, Inject } from '@angular/core';
import { InfuraService } from '../services/infura/infura.service';
import { AleqService } from '../services/aleq/aleq.service';
import { DataService } from '../services/data/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Web3Service } from '../services/metamask/web3.service';
import { MatSnackBar } from '@angular/material';

export interface DialogData {
  mintNumber: number;
  unmintNumber: number;
  totalSharesNumber: number;
  collateralRateNumber: number;
  claimPeriodNumber: number;
  ownerAddressHex: any;
}

@Component({
  selector: 'app-dialog-minting',
  templateUrl: './dialog-components/dialog-minting.html',
  styleUrls: ['./dialog-components/dialog-minting.scss'],
})

export class DialogMintingComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogMintingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dialog-unminting',
  templateUrl: './dialog-components/dialog-unminting.html',
  styleUrls: ['./dialog-components/dialog-unminting.scss'],
})

export class DialogUnmintingComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogUnmintingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dialog-total-shares',
  templateUrl: './dialog-components/dialog-total-shares.html',
  styleUrls: ['./dialog-components/dialog-total-shares.scss'],
})

export class DialogTotalSharesComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogTotalSharesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dialog-pausing',
  templateUrl: './dialog-components/dialog-pausing.html',
  styleUrls: ['./dialog-components/dialog-pausing.scss'],
})

export class DialogPausingComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogPausingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dialog-unpausing',
  templateUrl: './dialog-components/dialog-unpausing.html',
  styleUrls: ['./dialog-components/dialog-unpausing.scss'],
})

export class DialogUnpausingComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogUnpausingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dialog-collateral-rate',
  templateUrl: './dialog-components/dialog-collateral-rate.html',
  styleUrls: ['./dialog-components/dialog-collateral-rate.scss'],
})

export class DialogCollateralRateComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogCollateralRateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dialog-claim-period',
  templateUrl: './dialog-components/dialog-claim-period.html',
  styleUrls: ['./dialog-components/dialog-claim-period.scss'],
})

export class DialogClaimPeriodComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogClaimPeriodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dialog-change-owner',
  templateUrl: './dialog-components/dialog-change-owner.html',
  styleUrls: ['./dialog-components/dialog-change-owner.scss'],
})

export class DialogChangeOwnerComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogChangeOwnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dialog-renounce-ownership',
  templateUrl: './dialog-components/dialog-renounce-ownership.html',
  styleUrls: ['./dialog-components/dialog-renounce-ownership.scss'],
})

export class DialogRenounceOwnershipComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogRenounceOwnershipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async changeClick() {
    this.dialogRef.close();
  }

  async noClick() {
    this.dialogRef.close();
  }

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
  public mintNumber: number;
  public unmintNumber: number;
  public totalSharesNumber: number;
  public collateralRateNumber: number;
  public claimPeriodNumber: number;
  public ownerAddressHex: any;
  public web3: any;
  public txID: any;

  constructor(
    private infuraService: InfuraService,
    private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar
    ) { }

  async ngOnInit() {
    await this.infuraService.bootstrapWeb3();
    await this.aleqService.bootstrapALEQ();
    await this.web3Service.bootstrapWeb3();

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
    const dialogRef = this.dialog.open(DialogMintingComponent, {
      width: '500px',
      data: {mintNumber: this.mintNumber}
    });
  }
  openUnmintDialog() {
    const dialogRef = this.dialog.open(DialogUnmintingComponent, {
      width: '500px',
      data: {unmintNumber: this.unmintNumber}
    });
  }
  openTotalSharesDialog() {
    const dialogRef = this.dialog.open(DialogTotalSharesComponent, {
      width: '500px',
      data: {totalSharesNumber: this.totalSharesNumber}
    });
  }
  openPausingDialog() {
    const dialogRef = this.dialog.open(DialogPausingComponent, {
      width: '500px'
    });
  }
  openUnpausingDialog() {
    const dialogRef = this.dialog.open(DialogUnpausingComponent, {
      width: '500px'
    });
  }
  openCollateralRateDialog() {
    const dialogRef = this.dialog.open(DialogCollateralRateComponent, {
      width: '500px',
      data: {collateralRateNumber: this.collateralRateNumber}
    });
  }
  openClaimPeriodDialog() {
    const dialogRef = this.dialog.open(DialogClaimPeriodComponent, {
      width: '500px',
      data: {claimPeriodNumber: this.claimPeriodNumber}
    });
  }
  openChangeOwnerDialog() {
    const dialogRef = this.dialog.open(DialogChangeOwnerComponent, {
      width: '500px',
      data: {ownerAddressHex: this.ownerAddressHex}
    });
  }
  openRenounceOwnershipDialog() {
    const dialogRef = this.dialog.open(DialogRenounceOwnershipComponent, {
      width: '500px'
    });
  }

  async onTest() {
    const network = await this.web3Service.web3.eth.net.getId();
    if (network === 4) {
    console.log(network);
    // this.txID = await this.aleqService.allowance(price, this.numberOfShares, this.selectedAccount);
    } else {
      this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
    }
  }
}
