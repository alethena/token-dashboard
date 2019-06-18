import { Component, OnInit } from '@angular/core';
import { InfuraService } from '../services/infura/infura.service';
import { AleqService } from '../services/aleq/aleq.service';
import { DataService } from '../services/data/data.service';

@Component({
  selector: 'app-equity',
  templateUrl: './equity.component.html',
  styleUrls: ['./equity.component.scss']
})

export class EquityComponent implements OnInit {
  public pauseStatus = 'FUUUUUUCK';

  constructor(private infuraService: InfuraService, private aleqService: AleqService, private dataService: DataService) { }

  async ngOnInit() {
    await this.infuraService.bootstrapWeb3();
    await this.aleqService.bootstrapALEQ();
    this.dataService.pauseStatusObservable.subscribe((newPauseStatus) => {
      this.pauseStatus = newPauseStatus;
    });
  }

}
