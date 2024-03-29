import { Component, OnInit, Inject } from '@angular/core';
import { AleqService } from '../services/aleq/aleq.service';
import { DataService } from '../services/data/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Web3Service } from '../services/metamask/web3.service';
import { MatSnackBar } from '@angular/material';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isAddress } from 'web3-utils';
import { EquityComponent } from '../equity/equity.component';

declare var require: any;
const config = require('../equity/companyInformation.json');
const bigInt = require('big-integer');

export interface DialogData {
  ownerAddressHex: any;
  selectedContract: any;
  sharesAmount: number;
  XCHFAmount: number;
  retrieveXCHF: number;
  retrieveShares: number;
  newVolume: number;
  minPrice: number;
  maxPrice: number;
  slope: number;
}

@Component({
  selector: 'app-dialog-slope',
  templateUrl: './dialog-components-sd/dialog-slope.html',
  styleUrls: ['./dialog-components-sd/dialog-slope.scss'],
})

export class DialogSetSlopeComponent implements OnInit {
  public web3: any;
  public txID: any;
  public impliedSlope: number;
  public selectedAccount: string;
  public ownerAddress: any;
  public orderFormGroup: FormGroup;
  public pauseStatus: boolean;
  public minPriceSD: number;
  public maxPriceSD: number;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogSetSlopeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        priceSlope: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('priceSlope').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async priceSlope => {
          if (this.data.slope !== null) {
            this.data.slope = priceSlope;
            if (this.data.slope <= 0) {
              this.orderFormGroup.patchValue({ 'priceSlope': 1 });
            } else if (Math.ceil(this.data.slope) !== priceSlope) {
              this.orderFormGroup.patchValue({ 'priceSlope': Math.ceil(priceSlope) });
            }
        }
        this.impliedSlope = (this.maxPriceSD / 1000000000000000000 - this.minPriceSD / 1000000000000000000)
        / (2 * this.data.slope - 1);
        });
    }

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.SDpauseStatusObservable.subscribe((newPauseStatus) => {
        this.pauseStatus = newPauseStatus;
      });
      await this.dataService.SDminPriceObservable.subscribe((newMinPrice) => {
        this.minPriceSD = parseFloat(newMinPrice);
      });
      await this.dataService.SDmaxPriceObservable.subscribe((newMaxPrice) => {
        this.maxPriceSD = parseFloat(newMaxPrice);
      });
    }

    async setPriceSlopeCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true && this.pauseStatus === true) {
      this.txID = await this.aleqService.setSlope(this.data.selectedContract, this.data.slope, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
      } else if (this.pauseStatus === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You must first pause the Share Dispenser contract prior to proceeding with the requested change.', null, { duration: 6000 });
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
  selector: 'app-dialog-max-price',
  templateUrl: './dialog-components-sd/dialog-max-price.html',
  styleUrls: ['./dialog-components-sd/dialog-max-price.scss'],
})

export class DialogSetMaxPriceComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;
  public orderFormGroup: FormGroup;
  public pauseStatus: boolean;
  public minPriceSD: number;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogSetMaxPriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        priceInXCHF: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('priceInXCHF').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async priceInXCHF => {
          if (this.data.maxPrice !== null) {
            this.data.maxPrice = priceInXCHF;
            if (this.data.maxPrice < 0) {
              this.orderFormGroup.patchValue({ 'priceInXCHF': 1 });
            } else if (this.data.maxPrice < this.minPriceSD / 1000000000000000000) {
              this.orderFormGroup.patchValue({ 'priceInXCHF': this.minPriceSD / 1000000000000000000});
            }
          }
        });
    }

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.SDpauseStatusObservable.subscribe((newPauseStatus) => {
        this.pauseStatus = newPauseStatus;
      });
      await this.dataService.SDminPriceObservable.subscribe((newMinPrice) => {
        this.minPriceSD = parseFloat(newMinPrice);
      });
    }

    async setMaxPriceCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true && this.pauseStatus === true) {
      this.txID = await this.aleqService.setPrice(this.data.selectedContract, 'max', this.data.maxPrice * 100, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
      } else if (this.pauseStatus === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You must first pause the Share Dispenser contract prior to proceeding with the requested change.', null, { duration: 6000 });
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
  selector: 'app-dialog-min-price',
  templateUrl: './dialog-components-sd/dialog-min-price.html',
  styleUrls: ['./dialog-components-sd/dialog-min-price.scss'],
})

export class DialogSetMinPriceComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;
  public orderFormGroup: FormGroup;
  public pauseStatus: boolean;
  public maxPriceSD: number;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogSetMinPriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        priceInXCHF: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('priceInXCHF').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async priceInXCHF => {
          if (this.data.minPrice !== null) {
            this.data.minPrice = priceInXCHF;
            if (this.data.minPrice < 0) {
              this.orderFormGroup.patchValue({ 'priceInXCHF': 1 });
            } else if (this.data.minPrice > this.maxPriceSD / 1000000000000000000) {
              this.orderFormGroup.patchValue({ 'priceInXCHF': this.maxPriceSD / 1000000000000000000});
            }
          }
        });
    }

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.SDpauseStatusObservable.subscribe((newPauseStatus) => {
        this.pauseStatus = newPauseStatus;
      });
      await this.dataService.SDmaxPriceObservable.subscribe((newMaxPrice) => {
        this.maxPriceSD = parseFloat(newMaxPrice);
      });
    }

    async setMinPriceCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true && this.pauseStatus === true) {
      this.txID = await this.aleqService.setPrice(this.data.selectedContract, 'min', this.data.minPrice * 100, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
      } else if (this.pauseStatus === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You must first pause the Share Dispenser contract prior to proceeding with the requested change.', null, { duration: 6000 });
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
  templateUrl: './dialog-components-sd/dialog-pausing.html',
  styleUrls: ['./dialog-components-sd/dialog-pausing.scss'],
})

export class DialogPausingSDComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogPausingSDComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
    }

    async pausingCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.pause(this.data.selectedContract, true, this.selectedAccount[0]);
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
  templateUrl: './dialog-components-sd/dialog-unpausing.html',
  styleUrls: ['./dialog-components-sd/dialog-unpausing.scss'],
})

export class DialogUnpausingSDComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogUnpausingSDComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
    }

    async unpausingCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.pause(this.data.selectedContract, false, this.selectedAccount[0]);
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
  selector: 'app-dialog-disable-sell',
  templateUrl: './dialog-components-sd/dialog-disable-sell.html',
  styleUrls: ['./dialog-components-sd/dialog-disable-sell.scss'],
})

export class DialogDisableSellComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogDisableSellComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
    }

    async updateStatusCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.updateStatus(this.data.selectedContract, 'sell', true, this.selectedAccount[0]);
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
  selector: 'app-dialog-enable-sell',
  templateUrl: './dialog-components-sd/dialog-enable-sell.html',
  styleUrls: ['./dialog-components-sd/dialog-enable-sell.scss'],
})

export class DialogEnableSellComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogEnableSellComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
    }

    async updateStatusCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.updateStatus(this.data.selectedContract, 'sell', false, this.selectedAccount[0]);
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
  selector: 'app-dialog-disable-buy',
  templateUrl: './dialog-components-sd/dialog-disable-buy.html',
  styleUrls: ['./dialog-components-sd/dialog-disable-buy.scss'],
})

export class DialogDisableBuyComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogDisableBuyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
    }

    async updateStatusCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.updateStatus(this.data.selectedContract, 'buy', true, this.selectedAccount[0]);
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
  selector: 'app-dialog-enable-buy',
  templateUrl: './dialog-components-sd/dialog-enable-buy.html',
  styleUrls: ['./dialog-components-sd/dialog-enable-buy.scss'],
})

export class DialogEnableBuyComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogEnableBuyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
    }

    async updateStatusCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.updateStatus(this.data.selectedContract, 'buy', false, this.selectedAccount[0]);
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
  selector: 'app-dialog-retrieve-xchf',
  templateUrl: './dialog-components-sd/dialog-min-volume.html',
  styleUrls: ['./dialog-components-sd/dialog-min-volume.scss'],
})

export class DialogSetVolumeComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;
  public orderFormGroup: FormGroup;
  public availableSharesSD: number;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogSetVolumeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        numberOfShares: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('numberOfShares').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async numberOfShares => {
          if (this.data.newVolume !== null) {
            this.data.newVolume = numberOfShares;
            if (this.data.newVolume < 0) {
              this.orderFormGroup.patchValue({ 'numberOfShares': 1 });
            } else if (this.data.newVolume > this.availableSharesSD) {
              this.orderFormGroup.patchValue({ 'numberOfShares': this.availableSharesSD });
            } else if (Math.ceil(this.data.newVolume) !== numberOfShares) {
              this.orderFormGroup.patchValue({ 'numberOfShares': Math.ceil(numberOfShares) });
            }
          }
        });
    }

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.SDavailableSharesObservable.subscribe((newAvailableShare) => {
        this.availableSharesSD = parseFloat(newAvailableShare);
      });
    }

    async setMinTradingVolumeCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.changeTradeVolume(this.data.selectedContract, this.data.newVolume, this.selectedAccount[0]);
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
  selector: 'app-dialog-retrieve-xchf',
  templateUrl: './dialog-components-sd/dialog-retrieve-xchf.html',
  styleUrls: ['./dialog-components-sd/dialog-retrieve-xchf.scss'],
})

export class DialogRetrieveXCHFComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;
  public orderFormGroup: FormGroup;
  public pauseStatus: boolean;
  public availableXCHFSD: number;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogRetrieveXCHFComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        numberOfXCHF: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('numberOfXCHF').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async numberOfXCHF => {
          if (this.data.retrieveXCHF !== null) {
            this.data.retrieveXCHF = numberOfXCHF;
            if (this.data.retrieveXCHF < 0) {
              this.orderFormGroup.patchValue({ 'numberOfXCHF': 1 });
            } else if (this.data.retrieveXCHF > this.availableXCHFSD) {
              this.orderFormGroup.patchValue({ 'numberOfXCHF': this.availableXCHFSD });
            } else if (Math.ceil(this.data.retrieveXCHF) !== numberOfXCHF) {
              this.orderFormGroup.patchValue({ 'numberOfXCHF': Math.ceil(numberOfXCHF) });
            }
          }
        });
    }

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.SDpauseStatusObservable.subscribe((newPauseStatus) => {
        this.pauseStatus = newPauseStatus;
      });
      await this.dataService.SDavailableXCHFObservable.subscribe((newAvailableXCHF) => {
        this.availableXCHFSD = parseFloat(newAvailableXCHF);
      });
    }

    async retrieveXCHFCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      const XCHFNumberBN = bigInt(this.data.retrieveXCHF);
      if (network === 4 && ownerFlag === true && this.pauseStatus === true) {
      this.txID = await this.aleqService.retrieveSD(this.data.selectedContract, 'XCHF',
      this.selectedAccount[0], XCHFNumberBN, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
      } else if (this.pauseStatus === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You must first pause the Share Dispenser contract prior to proceeding with the requested change.', null, { duration: 6000 });
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
  selector: 'app-dialog-retrieve-shares',
  templateUrl: './dialog-components-sd/dialog-retrieve-shares.html',
  styleUrls: ['./dialog-components-sd/dialog-retrieve-shares.scss'],
})

export class DialogRetrieveSharesComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;
  public orderFormGroup: FormGroup;
  public pauseStatus: boolean;
  public availableSharesSD: number;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogRetrieveSharesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        numberOfShares: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('numberOfShares').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async numberOfShares => {
          if (this.data.retrieveShares !== null) {
            this.data.retrieveShares = numberOfShares;
            if (this.data.retrieveShares < 0) {
              this.orderFormGroup.patchValue({ 'numberOfShares': 1 });
            } else if (this.data.retrieveShares > this.availableSharesSD) {
              this.orderFormGroup.patchValue({ 'numberOfShares': this.availableSharesSD });
            } else if (Math.ceil(this.data.retrieveShares) !== numberOfShares) {
              this.orderFormGroup.patchValue({ 'numberOfShares': Math.ceil(numberOfShares) });
            }
          }
        });
    }

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.SDpauseStatusObservable.subscribe((newPauseStatus) => {
        this.pauseStatus = newPauseStatus;
      });
      await this.dataService.SDavailableSharesObservable.subscribe((newAvailableShare) => {
        this.availableSharesSD = parseFloat(newAvailableShare);
      });
    }

    async retrieveSharesCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true && this.pauseStatus === true) {
      this.txID = await this.aleqService.retrieveSD(this.data.selectedContract, 'EQ',
      this.selectedAccount[0], this.data.retrieveShares, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
      } else if (this.pauseStatus === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You must first pause the Share Dispenser contract prior to proceeding with the requested change.', null, { duration: 6000 });
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
  selector: 'app-dialog-feed-shares',
  templateUrl: './dialog-components-sd/dialog-feed-shares.html',
  styleUrls: ['./dialog-components-sd/dialog-feed-shares.scss'],
})

export class DialogFeedSharesComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;
  public orderFormGroup: FormGroup;
  public pauseStatus: boolean;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogFeedSharesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        numberOfTokens: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('numberOfTokens').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async numberOfTokens => {
          if (this.data.sharesAmount !== null) {
            this.data.sharesAmount = numberOfTokens;
            if (this.data.sharesAmount < 0) {
              this.orderFormGroup.patchValue({ 'numberOfTokens': 1 });
            } else if (Math.ceil(this.data.sharesAmount) !== numberOfTokens) {
              this.orderFormGroup.patchValue({ 'numberOfTokens': Math.ceil(numberOfTokens) });
            }
          }
        });
    }

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.SDpauseStatusObservable.subscribe((newPauseStatus) => {
        this.pauseStatus = newPauseStatus;
      });
    }

    async feedSharesCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      if (network === 4 && ownerFlag === true && this.pauseStatus === true) {
      this.txID = await this.aleqService.feedSharesSD(this.data.selectedContract, this.data.sharesAmount, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
      } else if (this.pauseStatus === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You must first pause the Share Dispenser contract prior to proceeding with the requested change.', null, { duration: 6000 });
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
  selector: 'app-dialog-feed-xchf',
  templateUrl: './dialog-components-sd/dialog-feed-xchf.html',
  styleUrls: ['./dialog-components-sd/dialog-feed-xchf.scss'],
})

export class DialogFeedXCHFComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddress: any;
  public orderFormGroup: FormGroup;
  public pauseStatus: boolean;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogFeedXCHFComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.orderFormGroup = this._formBuilder.group({
        numberOfXCHF: [0, [Validators.required, Validators.min(1)]],
      });
      this.orderFormGroup.get('numberOfXCHF').valueChanges
        .pipe(debounceTime(250))
        .subscribe(async numberOfXCHF => {
          if (this.data.XCHFAmount !== null) {
            this.data.XCHFAmount = numberOfXCHF;
            if (this.data.XCHFAmount < 0) {
              this.orderFormGroup.patchValue({ 'numberOfXCHF': 1 });
            } else if (Math.ceil(this.data.XCHFAmount) !== numberOfXCHF) {
              this.orderFormGroup.patchValue({ 'numberOfXCHF': Math.ceil(numberOfXCHF) });
            }
          }
        });
    }

    async ngOnInit() {
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddress) => {
        this.ownerAddress = newOwnerAddress;
      });
      await this.dataService.SDpauseStatusObservable.subscribe((newPauseStatus) => {
        this.pauseStatus = newPauseStatus;
      });
    }

    async feedXCHFCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddress;
      const XCHFNumberBN = bigInt(this.data.XCHFAmount);
      if (network === 4 && ownerFlag === true && this.pauseStatus === true) {
      this.txID = await this.aleqService.feedXCHFSD(this.data.selectedContract, XCHFNumberBN, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in as the owner of the contract. Please connect to the owner address in your Web3 application in order to enable changes.', null, { duration: 6000 });
      } else if (this.pauseStatus === false) {
      // tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You must first pause the Share Dispenser contract prior to proceeding with the requested change.', null, { duration: 6000 });
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
  templateUrl: './dialog-components-sd/dialog-change-owner.html',
  styleUrls: ['./dialog-components-sd/dialog-change-owner.scss'],
})

export class DialogChangeOwnerSDComponent implements OnInit {
  public web3: any;
  public txID: any;
  public selectedAccount: string;
  public ownerAddressSD: any;
  public orderFormGroup: FormGroup;

  constructor(private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogChangeOwnerSDComponent>,
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
      await this.web3Service.bootstrapWeb3();
      await this.bootstrapAccounts();
      await this.dataService.SDownerAddressObservable.subscribe((newOwnerAddressSD) => {
        this.ownerAddressSD = newOwnerAddressSD;
      });
    }

    async changeOwnerSDCall() {
      this.dialogRef.close();
      const network = await this.web3Service.web3.eth.net.getId();
      const ownerFlag = await this.selectedAccount[0] === this.ownerAddressSD;
      if (network === 4 && ownerFlag === true) {
      this.txID = await this.aleqService.changeOwnerSD(this.data.selectedContract, this.data.ownerAddressHex, this.selectedAccount[0]);
      } else if (network !== 4) {
        this.matSnackBar.open('Please select the Rinkeby network in MetaMask.', null, { duration: 6000 });
      } else if (ownerFlag === false) {
// tslint:disable-next-line: max-line-length
      this.matSnackBar.open('You are currently not logged in via the owner address of the contract. Please connect to the owner address in your Web3 application in order to enable an owner change.', null, { duration: 6000 });
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
  selector: 'app-sharedispenser',
  templateUrl: './sharedispenser.component.html',
  styleUrls: ['./sharedispenser.component.scss'],
  providers: [EquityComponent]
})
export class SharedispenserComponent implements OnInit {
  public pauseStatus = false;
  public nameStatus = 'Loading';
  public symbolStatus = 'Loading';
  public contractAddressSD = 'Loading';
  public ownerAddressSD = 'Loading';
  public XCHFAddressSD = 'Loading';
  public numberOfSharesSet: number;
  public availableSharesSD: number;
  public availableXCHFSD: number;
  public minPriceSD: number;
  public maxPriceSD: number;
  public slopeSD: number;
  public minVolumeSD: number;
  public buySideStatusSD = false;
  public sellSideStatusSD = false;
  public pauseStatusSD = false;
  public MMenabled = false;
  public ownerAddressHex: any;
  public sharesAmount: number;
  public XCHFAmount: number;
  public retrieveShares: number;
  public retrieveXCHF: number;
  public newVolume: number;
  public minPrice: number;
  public maxPrice: number;
  public slope: number;
  public selected = '0x40A1BE7f167C7f14D7EDE17972bC7c87b91e1D91';
  public selectedTool = 'EQ';
  public companyName = config[this.selected].NAME;
  public companyWebsite = config[this.selected].WEBSITE;
  public companyUID = config[this.selected].UID;
  public companyUIDLink = config[this.selected].UIDLINK;

  constructor(private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private equityComponent: EquityComponent
    ) { }

    async ngOnInit() {
    this.dataService.selectedContractObservable.subscribe((newSelected) => {
      this.selected = newSelected;
      this.companyName = config[this.selected].NAME;
      this.companyWebsite = config[this.selected].WEBSITE;
      this.companyUID = config[this.selected].UID;
      this.companyUIDLink = config[this.selected].UIDLINK;
    });
    this.dataService.MMenabledObservable.subscribe((newMMenabled) => {
      this.MMenabled = newMMenabled;
    });
    this.dataService.selectedToolObservable.subscribe((newSelectedTool) => {
      this.selectedTool = newSelectedTool;
    });
    this.dataService.pauseStatusObservable.subscribe((newPauseStatus) => {
      this.pauseStatus = newPauseStatus;
    });
    this.dataService.nameStatusObservable.subscribe((newNameStatus) => {
      this.nameStatus = newNameStatus;
    });
    this.dataService.symbolStatusObservable.subscribe((newSymbolStatus) => {
      this.symbolStatus = newSymbolStatus;
    });
    this.dataService.SDcontractAddressObservable.subscribe((newContractAddressSD) => {
      this.contractAddressSD = newContractAddressSD;
    });
    this.dataService.SDownerAddressObservable.subscribe((newOwnerAddressSD) => {
      this.ownerAddressSD = newOwnerAddressSD;
    });
    this.dataService.XCHFcontractAddressObservable.subscribe((newXCHFAddressSD) => {
      this.XCHFAddressSD = newXCHFAddressSD;
    });
    this.dataService.SDavailableSharesObservable.subscribe((newAvailableShare) => {
      this.availableSharesSD = parseFloat(newAvailableShare);
    });
    this.dataService.SDavailableXCHFObservable.subscribe((newAvailableXCHF) => {
      this.availableXCHFSD = parseFloat(newAvailableXCHF);
    });
    this.dataService.SDminPriceObservable.subscribe((newMinPrice) => {
      this.minPriceSD = parseFloat(newMinPrice);
    });
    this.dataService.SDmaxPriceObservable.subscribe((newMaxPrice) => {
      this.maxPriceSD = parseFloat(newMaxPrice);
    });
    this.dataService.SDslopeObservable.subscribe((newSlope) => {
      this.numberOfSharesSet = parseFloat(newSlope);
      this.slopeSD = (((this.maxPriceSD / 1000000000000000000) - (this.minPriceSD / 1000000000000000000))
      / (2 * (this.numberOfSharesSet - 1) ));
    });
    this.dataService.SDminVolumeObservable.subscribe((newMinVolume) => {
      this.minVolumeSD = parseFloat(newMinVolume);
    });
    this.dataService.SDbuySideStatusObservable.subscribe((newBuySideStatus) => {
      this.buySideStatusSD = newBuySideStatus;
    });
    this.dataService.SDsellSideStatusObservable.subscribe((newSellSideStatus) => {
      this.sellSideStatusSD = newSellSideStatus;
    });
    this.dataService.SDpauseStatusObservable.subscribe((newPauseStatusSD) => {
      this.pauseStatusSD = newPauseStatusSD;
    });
  }

  public dialogCall(flag: any) {
    if (flag === 'Pausing') {
      this.equityComponent.openPausingDialog();
    } else if (flag === 'Unpausing') {
      this.equityComponent.openUnpausingDialog();
    }
  }

  openChangeOwnerSDDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogChangeOwnerSDComponent, {
      width: '500px',
      data: {ownerAddressHex: this.ownerAddressHex,
        selectedContract: this.selected}
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }

  openFeedSharesDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogFeedSharesComponent, {
      width: '500px',
      data: {sharesAmount: this.sharesAmount,
        selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }

  openFeedXCHFDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogFeedXCHFComponent, {
      width: '500px',
      data: {XCHFAmount: this.XCHFAmount,
        selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }

  openRetrieveSharesDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogRetrieveSharesComponent, {
      width: '500px',
      data: {retrieveShares: this.retrieveShares,
        selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }

  openRetrieveXCHFDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogRetrieveXCHFComponent, {
      width: '500px',
      data: {retrieveXCHF: this.retrieveXCHF,
        selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }

  openSetNewVolumeDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogSetVolumeComponent, {
      width: '500px',
      data: {newVolume: this.newVolume,
        selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }

  openPausingDialog(pausingFlag) {
  if (pausingFlag === false) {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogUnpausingSDComponent, {
      width: '500px',
      data: {newVolume: this.newVolume,
        selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  } else if (pausingFlag === true) {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogPausingSDComponent, {
      width: '500px',
      data: {newVolume: this.newVolume,
        selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
  }

  openUpdateStatusDialog(sideFlag, updateFlag) {
    if (sideFlag === 'buy' && updateFlag === false) {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogEnableBuyComponent, {
      width: '500px',
      data: {selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  } else if (sideFlag === 'buy' && updateFlag === true) {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogDisableBuyComponent, {
      width: '500px',
      data: {selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  } else if (sideFlag === 'sell' && updateFlag === false) {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogEnableSellComponent, {
      width: '500px',
      data: {selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  } else if (sideFlag === 'sell' && updateFlag === true) {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogDisableSellComponent, {
      width: '500px',
      data: {selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
  }

  openSetPriceDialog(priceFlag) {
    if (priceFlag === 'min') {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogSetMinPriceComponent, {
      width: '500px',
      data: {minPrice: this.minPrice,
        selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  } else if (priceFlag === 'max') {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogSetMaxPriceComponent, {
      width: '500px',
      data: {maxPrice: this.maxPrice,
        selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
  }

  openSetSlopeDialog() {
    if (this.web3Service.MM) {
    const dialogRef = this.dialog.open(DialogSetSlopeComponent, {
      width: '500px',
      data: {slope: this.slope,
        selectedContract: this.selected }
    });
  } else {
    this.web3Service.setStatus('Please use MetaMask to enable contract changes.');
  }
  }
}
