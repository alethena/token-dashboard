import { Component, OnInit, Inject } from '@angular/core';
import { InfuraService } from '../services/infura/infura.service';
import { AleqService } from '../services/aleq/aleq.service';
import { DataService } from '../services/data/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Web3Service } from '../services/metamask/web3.service';
import { AccountsService } from '../services/metamask/accounts.service';
import { MatSnackBar } from '@angular/material';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isAddress } from 'web3-utils';

declare var require: any;
const bigInt = require('big-integer');

export interface Contract {
  value: string;
  viewValue: string;
}

export interface DialogData {
  mintNumber: number;
  unmintNumber: number;
  totalSharesNumber: number;
  collateralRateNumber: number;
  claimPeriodNumber: number;
  ownerAddressHex: any;
}

@Component({
  selector: 'app-dialog-unminting',
  templateUrl: './dialog-components/dialog-unminting.html',
  styleUrls: ['./dialog-components/dialog-unminting.scss'],
})

export class DialogUnmintingComponent implements OnInit {
  public web3: any;
  public txID: any;
  public orderFormGroup: FormGroup;
  public selectedAccount: string;
  public ownerAddress: any;
  public totalSupplyStatus: any;
  public messageUnminting = 'Unminting of tokenized shares.';

  constructor(
    private infuraService: InfuraService,
    private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogUnmintingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.orderFormGroup = this._formBuilder.group({
          numberOfTokens: [0, [Validators.required, Validators.min(1)]],
        });
        this.orderFormGroup.get('numberOfTokens').valueChanges
          .pipe(debounceTime(250))
          .subscribe(async numberOfTokens => {
            if (this.data.unmintNumber !== null) {
              this.data.unmintNumber = numberOfTokens;
              if (this.data.unmintNumber < 0) {
                this.orderFormGroup.patchValue({ 'numberOfTokens': 1 });
              } else if (this.data.unmintNumber > this.totalSupplyStatus) {
                this.orderFormGroup.patchValue({ 'numberOfTokens': this.totalSupplyStatus });
              } else if (Math.ceil(this.data.unmintNumber) !== numberOfTokens) {
                this.orderFormGroup.patchValue({ 'numberOfTokens': Math.ceil(numberOfTokens) });
              }
            }
          });
    }

    async ngOnInit() {
      await this.infuraService.bootstrapWeb3();
      await this.aleqService.bootstrapALEQ();
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.ownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.totalSupplyStatusObservable.subscribe((newTotalSupplyStatus) => {
        this.totalSupplyStatus = parseFloat(newTotalSupplyStatus);
      });
    }

    async unmintingCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.unminting(this.data.unmintNumber,
        this.messageUnminting, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
// tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
     }
    }
    async bootstrapAccounts() {
      try {
        const accs = await this.web3Service.web3.eth.getAccounts();
        if (!this.selectedAccount || this.selectedAccount.length !== accs.length || this.selectedAccount[0] !== accs[0]) {
          this.dataService.accountsObservable.next(accs);
          this.dataService.accountObservable.next(accs[0]);
          this.selectedAccount = accs;
        }
      } catch (error) {
      }
    }

  async noClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dialog-minting',
  templateUrl: './dialog-components/dialog-minting.html',
  styleUrls: ['./dialog-components/dialog-minting.scss'],
})

export class DialogMintingComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;
  public orderFormGroup: FormGroup;
  public totalSharesStatus: any;
  public totalSupplyStatus: any;
  public messageMinting = 'Additional minting of tokenized shares.';

  constructor(
    private infuraService: InfuraService,
    private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogMintingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        numberOfTokens: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('numberOfTokens').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async numberOfTokens => {
          if (this.data.mintNumber !== null) {
            this.data.mintNumber = numberOfTokens;
            if (this.data.mintNumber < 0) {
              this.orderFormGroup.patchValue({ 'numberOfTokens': 1 });
            } else if (this.data.mintNumber + this.totalSupplyStatus > this.totalSharesStatus) {
              this.orderFormGroup.patchValue({ 'numberOfTokens': this.totalSharesStatus - this.totalSupplyStatus });
            } else if (Math.ceil(this.data.mintNumber) !== numberOfTokens) {
              this.orderFormGroup.patchValue({ 'numberOfTokens': Math.ceil(numberOfTokens) });
            }
          }
        });
    }

    async ngOnInit() {
      await this.infuraService.bootstrapWeb3();
      await this.aleqService.bootstrapALEQ();
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.ownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.totalSharesStatusObservable.subscribe((newTotalSharesStatus) => {
        this.totalSharesStatus = parseFloat(newTotalSharesStatus);
      });
      await this.dataService.totalSupplyStatusObservable.subscribe((newTotalSupplyStatus) => {
        this.totalSupplyStatus = parseFloat(newTotalSupplyStatus);
      });
    }

    async mintingCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.minting(this.selectedAccount[0], this.data.mintNumber,
        this.messageMinting, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
// tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
     }
    }
    async bootstrapAccounts() {
      try {
        const accs = await this.web3Service.web3.eth.getAccounts();
        if (!this.selectedAccount || this.selectedAccount.length !== accs.length || this.selectedAccount[0] !== accs[0]) {
          this.dataService.accountsObservable.next(accs);
          this.dataService.accountObservable.next(accs[0]);
          this.selectedAccount = accs;
        }
      } catch (error) {
      }
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

export class DialogTotalSharesComponent implements OnInit {
  public web3: any;
  public txID: any;
  public orderFormGroup: FormGroup;
  public selectedAccount: string;
  public ownerAddress: any;
  public totalSupplyStatus: any;

  constructor(
    private infuraService: InfuraService,
    private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogTotalSharesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        numberOfTokens: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('numberOfTokens').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async numberOfTokens => {
          if (this.data.totalSharesNumber !== null) {
            this.data.totalSharesNumber = numberOfTokens;
            if (this.data.totalSharesNumber < 0) {
              this.orderFormGroup.patchValue({ 'numberOfTokens': 1 });
            } else if (this.data.totalSharesNumber < this.totalSupplyStatus) {
              this.orderFormGroup.patchValue({ 'numberOfTokens': this.totalSupplyStatus });
            } else if (Math.ceil(this.data.totalSharesNumber) !== numberOfTokens) {
              this.orderFormGroup.patchValue({ 'numberOfTokens': Math.ceil(numberOfTokens) });
            }
          }
        });
    }

    async ngOnInit() {
      await this.infuraService.bootstrapWeb3();
      await this.aleqService.bootstrapALEQ();
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.ownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.totalSupplyStatusObservable.subscribe((newTotalSupplyStatus) => {
        this.totalSupplyStatus = parseFloat(newTotalSupplyStatus);
      });
    }

    async setTotalSharesCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.setTotalShares(this.data.totalSharesNumber, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
// tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
     }
    }
    async bootstrapAccounts() {
      try {
        const accs = await this.web3Service.web3.eth.getAccounts();
        if (!this.selectedAccount || this.selectedAccount.length !== accs.length || this.selectedAccount[0] !== accs[0]) {
          this.dataService.accountsObservable.next(accs);
          this.dataService.accountObservable.next(accs[0]);
          this.selectedAccount = accs;
        }
      } catch (error) {
      }
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

export class DialogPausingComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;

  constructor(
    private infuraService: InfuraService,
    private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogPausingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    async ngOnInit() {
      await this.infuraService.bootstrapWeb3();
      await this.aleqService.bootstrapALEQ();
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.ownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
    }

    async pausingCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const blockNumber = await this.web3Service.web3.eth.getBlockNumber();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.pausing(blockNumber, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
// tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
     }
    }
    async bootstrapAccounts() {
      try {
        const accs = await this.web3Service.web3.eth.getAccounts();
        if (!this.selectedAccount || this.selectedAccount.length !== accs.length || this.selectedAccount[0] !== accs[0]) {
          this.dataService.accountsObservable.next(accs);
          this.dataService.accountObservable.next(accs[0]);
          this.selectedAccount = accs;
        }
      } catch (error) {
      }
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

export class DialogUnpausingComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;

  constructor(
    private infuraService: InfuraService,
    private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogUnpausingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    async ngOnInit() {
      await this.infuraService.bootstrapWeb3();
      await this.aleqService.bootstrapALEQ();
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.ownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
    }

    async unpausingCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const blockNumber = await this.web3Service.web3.eth.getBlockNumber();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.unpausing(blockNumber, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
// tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
     }
    }
    async bootstrapAccounts() {
      try {
        const accs = await this.web3Service.web3.eth.getAccounts();
        if (!this.selectedAccount || this.selectedAccount.length !== accs.length || this.selectedAccount[0] !== accs[0]) {
          this.dataService.accountsObservable.next(accs);
          this.dataService.accountObservable.next(accs[0]);
          this.selectedAccount = accs;
        }
      } catch (error) {
      }
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

export class DialogCollateralRateComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;
  public claimPeriod: any;
  public orderFormGroup: FormGroup;

  constructor(
    private infuraService: InfuraService,
    private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogCollateralRateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        numberOfCollateral: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('numberOfCollateral').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async numberOfCollateral => {
          if (this.data.collateralRateNumber !== null) {
            this.data.collateralRateNumber = numberOfCollateral;
            if (this.data.collateralRateNumber < 0) {
              this.orderFormGroup.patchValue({ 'numberOfCollateral': 1 });
            } else if (Math.ceil(this.data.collateralRateNumber) !== numberOfCollateral) {
              this.orderFormGroup.patchValue({ 'numberOfCollateral': Math.ceil(numberOfCollateral) });
            }
          }
        });
    }

    async ngOnInit() {
      await this.infuraService.bootstrapWeb3();
      await this.aleqService.bootstrapALEQ();
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.ownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.claimPeriodObservable.subscribe((newClaimPeriod) => {
        this.claimPeriod = parseFloat(newClaimPeriod);
      });
    }

    async collateralRateCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const claimPeriod = this.claimPeriod;
      const collateralRate = bigInt(this.data.collateralRateNumber);
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.setClaimParameters(collateralRate, claimPeriod, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
// tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
     }
    }
    async bootstrapAccounts() {
      try {
        const accs = await this.web3Service.web3.eth.getAccounts();
        if (!this.selectedAccount || this.selectedAccount.length !== accs.length || this.selectedAccount[0] !== accs[0]) {
          this.dataService.accountsObservable.next(accs);
          this.dataService.accountObservable.next(accs[0]);
          this.selectedAccount = accs;
        }
      } catch (error) {
      }
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

export class DialogClaimPeriodComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;
  public collateralRate: any;
  public orderFormGroup: FormGroup;

  constructor(
    private infuraService: InfuraService,
    private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogClaimPeriodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        numberOfClaim: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('numberOfClaim').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async numberOfClaim => {
          if (this.data.claimPeriodNumber !== null) {
            this.data.claimPeriodNumber = numberOfClaim;
            if (this.data.claimPeriodNumber < 0) {
              this.orderFormGroup.patchValue({ 'numberOfClaim': 1 });
            } else if (this.data.claimPeriodNumber < 60 * 60 * 24 * 90) {
              this.orderFormGroup.patchValue({ 'numberOfClaim': 60 * 60 * 24 * 90 });
            } else if (Math.ceil(this.data.claimPeriodNumber) !== numberOfClaim) {
              this.orderFormGroup.patchValue({ 'numberOfClaim': Math.ceil(numberOfClaim) });
            }
          }
        });
    }

    async ngOnInit() {
      await this.infuraService.bootstrapWeb3();
      await this.aleqService.bootstrapALEQ();
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.ownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.collateralRateObservable.subscribe((newCollateralRate) => {
        this.collateralRate = parseFloat(newCollateralRate);
      });
    }

    async claimPeriodCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const collateralRate = this.collateralRate;
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.setClaimParameters(collateralRate, this.data.claimPeriodNumber, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
// tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
     }
    }
    async bootstrapAccounts() {
      try {
        const accs = await this.web3Service.web3.eth.getAccounts();
        if (!this.selectedAccount || this.selectedAccount.length !== accs.length || this.selectedAccount[0] !== accs[0]) {
          this.dataService.accountsObservable.next(accs);
          this.dataService.accountObservable.next(accs[0]);
          this.selectedAccount = accs;
        }
      } catch (error) {
      }
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

export class DialogChangeOwnerComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public masterAddress: any;
  public orderFormGroup: FormGroup;

  constructor(
    private infuraService: InfuraService,
    private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogChangeOwnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        hexAddress: ['', Validators.requiredTrue],
      });
      this.orderFormGroup.get('hexAddress').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async hexAddress => {
          if (isAddress(this.data.ownerAddressHex) === true) {
            this.data.ownerAddressHex = hexAddress;
          } else {
            this.orderFormGroup.patchValue({ 'hexAddress': '' });
          }
        });
    }

    async ngOnInit() {
      await this.infuraService.bootstrapWeb3();
      await this.aleqService.bootstrapALEQ();
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.masterAddressObservable.subscribe((newMasterAddress) => {
        this.masterAddress = newMasterAddress;
      });
    }

    async changeOwnerCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const masterFlag = await this.selectedAccount[0] === this.masterAddress;
      if (network === 4 && masterFlag === true) {
      this.txID = await this.aleqService.changeOwner(this.data.ownerAddressHex, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (masterFlag === false) {
// tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in via the master address of the contract. Please connect to the master address in your Web3 application in order to enable an owner change.', null, { duration: 6000 });
     }
    }
    async bootstrapAccounts() {
      try {
        const accs = await this.web3Service.web3.eth.getAccounts();
        if (!this.selectedAccount || this.selectedAccount.length !== accs.length || this.selectedAccount[0] !== accs[0]) {
          this.dataService.accountsObservable.next(accs);
          this.dataService.accountObservable.next(accs[0]);
          this.selectedAccount = accs;
        }
      } catch (error) {
      }
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

export class DialogRenounceOwnershipComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;

  constructor(
    private infuraService: InfuraService,
    private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogRenounceOwnershipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    async ngOnInit() {
      await this.infuraService.bootstrapWeb3();
      await this.aleqService.bootstrapALEQ();
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.ownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
    }

    async renounceOwnerCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.renounceOwnership(this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
// tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
     }
    }
    async bootstrapAccounts() {
      try {
        const accs = await this.web3Service.web3.eth.getAccounts();
        if (!this.selectedAccount || this.selectedAccount.length !== accs.length || this.selectedAccount[0] !== accs[0]) {
          this.dataService.accountsObservable.next(accs);
          this.dataService.accountObservable.next(accs[0]);
          this.selectedAccount = accs;
        }
      } catch (error) {
      }
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

  title = 'Alethena\'s Token Dashboard';
  contracts: Contract[] = [
    {value: 'contract-0', viewValue: 'Quitt'},
    {value: 'contract-1', viewValue: 'Alethena'},
    {value: 'contract-2', viewValue: 'LEXR'}
  ];

  constructor(
    private infuraService: InfuraService,
    private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    private accountsService: AccountsService,
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
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogMintingComponent, {
      width: '500px',
      data: {mintNumber: this.mintNumber}
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
  openUnmintDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogUnmintingComponent, {
      width: '500px',
      data: {unmintNumber: this.unmintNumber}
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
  openTotalSharesDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogTotalSharesComponent, {
      width: '500px',
      data: {totalSharesNumber: this.totalSharesNumber}
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
  openPausingDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogPausingComponent, {
      width: '500px'
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
  openUnpausingDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogUnpausingComponent, {
      width: '500px'
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
  openCollateralRateDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogCollateralRateComponent, {
      width: '500px',
      data: {collateralRateNumber: this.collateralRateNumber}
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
  openClaimPeriodDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogClaimPeriodComponent, {
      width: '500px',
      data: {claimPeriodNumber: this.claimPeriodNumber}
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
  openChangeOwnerDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogChangeOwnerComponent, {
      width: '500px',
      data: {ownerAddressHex: this.ownerAddressHex}
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
  openRenounceOwnershipDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogRenounceOwnershipComponent, {
      width: '500px'
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
}
