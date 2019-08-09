import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data/data.service';
import { MatDialog } from '@angular/material/dialog';
import { Web3Service } from '../services/metamask/web3.service';
import { MatSnackBar } from '@angular/material';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-claimtool',
  templateUrl: './claimtool.component.html',
  styleUrls: ['./claimtool.component.scss']
})
export class ClaimtoolComponent implements OnInit {
  public MMenabled = false;
  public selected = '0x40A1BE7f167C7f14D7EDE17972bC7c87b91e1D91';
  public selectedTool = 'EQ';

  constructor(private dataService: DataService,
    private web3Service: Web3Service,
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private _formBuilder: FormBuilder
    ) { }

  async ngOnInit() {
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
