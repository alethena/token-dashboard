import { Component, OnInit } from '@angular/core';
// import { InfuraService } from '../services/infura/infura.service';
// import { AleqService } from '../services/aleq/aleq.service';
import { DataService } from '../services/data/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Web3Service } from '../services/metamask/web3.service';
// import { AccountsService } from '../services/metamask/accounts.service';
import { MatSnackBar } from '@angular/material';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isAddress } from 'web3-utils';

declare var require: any;
const config2 = require('../equity/companyInformation.json');

@Component({
  selector: 'app-sharedispenser',
  templateUrl: './sharedispenser.component.html',
  styleUrls: ['./sharedispenser.component.scss']
})
export class SharedispenserComponent implements OnInit {
  public pauseStatus = false;
  public nameStatus = 'Loading';
  public symbolStatus = 'Loading';
  public MMenabled = false;
  public selected = '0x40A1BE7f167C7f14D7EDE17972bC7c87b91e1D91';
  public selectedTool = 'EQ';
  public companyName = config2[this.selected].NAME;
  public companyWebsite = config2[this.selected].WEBSITE;
  public companyUID = config2[this.selected].UID;
  public companyUIDLink = config2[this.selected].UIDLINK;

  constructor(// private infuraService: InfuraService,
    // private aleqService: AleqService,
    private dataService: DataService,
    private web3Service: Web3Service,
    // private accountsService: AccountsService,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder
    ) { }

    async ngOnInit() {
    // await this.infuraService.bootstrapWeb3();
    // await this.aleqService.bootstrapALEQ(this.selected);
    // await this.web3Service.bootstrapWeb3();
    this.dataService.selectedContractObservable.subscribe((newSelected) => {
      this.selected = newSelected;
      this.companyName = config2[this.selected].NAME;
      this.companyWebsite = config2[this.selected].WEBSITE;
      this.companyUID = config2[this.selected].UID;
      this.companyUIDLink = config2[this.selected].UIDLINK;
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
  }
}
