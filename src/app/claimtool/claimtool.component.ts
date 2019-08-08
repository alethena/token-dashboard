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

@Component({
  selector: 'app-claimtool',
  templateUrl: './claimtool.component.html',
  styleUrls: ['./claimtool.component.scss']
})
export class ClaimtoolComponent implements OnInit {
  public MMenabled = false;
  public selected = '0x40A1BE7f167C7f14D7EDE17972bC7c87b91e1D91';
  public selectedTool = 'EQ';

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
    });
    this.dataService.MMenabledObservable.subscribe((newMMenabled) => {
      this.MMenabled = newMMenabled;
    });
    this.dataService.selectedToolObservable.subscribe((newSelectedTool) => {
      this.selectedTool = newSelectedTool;
    });
  }

}
