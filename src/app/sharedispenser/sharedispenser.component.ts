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

export interface DialogData {
  ownerAddressHex: any;
  selectedContract: any;
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
  public MMenabled = false;
  public ownerAddressHex: any;
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
}
