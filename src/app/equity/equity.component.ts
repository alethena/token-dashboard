import { Component, OnInit } from '@angular/core';
import { InfuraService } from '../services/infura/infura.service';
import { AleqService } from '../services/aleq/aleq.service';
import { DataService } from '../services/data/data.service';

@Component({
  selector: 'app-equity',
  templateUrl: './equity.component.html',
  styleUrls: ['./equity.component.scss'],
})

export class EquityComponent implements OnInit {
  public pauseStatus = 'N/A';
  public nameStatus = 'N/A';
  public symbolStatus = 'N/A';
  public totalSupplyStatus = 'N/A';
  public totalSharesStatus = 'N/A';

  constructor(private infuraService: InfuraService, private aleqService: AleqService, private dataService: DataService) { }

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
      this.totalSupplyStatus = newTotalSupplyStatus;
    });
    this.dataService.totalSharesStatusObservable.subscribe((newTotalSharesStatus) => {
      this.totalSharesStatus = newTotalSharesStatus;
    });
  }

}
