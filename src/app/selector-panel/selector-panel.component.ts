import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../services/metamask/web3.service';
import { AleqService } from '../services/aleq/aleq.service';
import { DataService } from '../services/data/data.service';
import { InfuraService } from '../services/infura/infura.service';
// import { Router } from '@angular/router';

export interface Contract {
  value: string;
  viewValue: string;
}

export interface Tools {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-selector-panel',
  templateUrl: './selector-panel.component.html',
  styleUrls: ['./selector-panel.component.scss']
})
export class SelectorPanelComponent implements OnInit {
  public MMenabled = false;

  contracts: Contract[] = [
   {value: '0x18A4251cD23A4e235987a11d2d36C0138E95fA7c', viewValue: 'Alethena'},
   {value: '0x204B0020923C906D8BF2e1FB2fd8C43e612A68f4', viewValue: 'Quitt'},
   {value: '0x40A1BE7f167C7f14D7EDE17972bC7c87b91e1D91', viewValue: 'Test AG'}
 ];
 public selected = '0x40A1BE7f167C7f14D7EDE17972bC7c87b91e1D91';

  tools: Tools[] = [
   {value: 'EQ', viewValue: 'Equity'},
   {value: 'SD', viewValue: 'Share Dispenser'},
   {value: 'CL', viewValue: 'Claim'}
  ];
  public selectedTool = 'EQ';

 constructor(private infuraService: InfuraService,
   private web3Service: Web3Service,
   private aleqService: AleqService,
   private dataService: DataService,
   // private router: Router
   ) { }

 async ngOnInit() {
  await this.infuraService.bootstrapWeb3();
  await this.aleqService.bootstrapALEQ(this.selected);
   this.dataService.MMenabledObservable.subscribe((newMMenabled) => {
     this.MMenabled = newMMenabled;
   });
   this.dataService.selectedContractObservable.next(this.selected);
   this.dataService.selectedToolObservable.next(this.selectedTool);
 }
 public refreshContractAddress(event: any) {
   if (event.source.controlType === 'mat-select') {
     this.dataService.selectedContractObservable.next(event.value);
     this.selected = event.value;
     this.aleqService.bootstrapALEQ(this.selected);
   }
 }
 public navigateTo(event: any) {
  // if (event.source.controlType === 'mat-select' && event.value === 'EQ') {
  //   this.router.navigate(['/', 'equity']);
  //   this.dataService.selectedToolObservable.next(event.value);
  // } else if (event.source.controlType === 'mat-select' && event.value === 'SD') {
  //   this.router.navigate(['/', 'sharedispenser']);
  // } else if (event.source.controlType === 'mat-select' && event.value === 'CL') {
  //   this.router.navigate(['/', 'claim']);
  // }
  if (event.source.controlType === 'mat-select') {
    this.dataService.selectedToolObservable.next(event.value);
  }
}
 async getAccountFromMetaMask() {
   if (!this.web3Service.MM) {
     try {
       await this.web3Service.bootstrapWeb3();
     } catch (error) {
     }
   }
 }
}
