import { Injectable } from '@angular/core';
import { InfuraService } from '../infura/infura.service';
import { DataService } from '../data/data.service';
declare var require: any;

const ALEQData = require('../../../../helpers/ALEQ.json');
const ALEQAddress = '0x18a4251cd23a4e235987a11d2d36c0138e95fa7c';

@Injectable({
  providedIn: 'root'
})
export class AleqService {
  ALEQInstance: any;

  constructor(private infuraService: InfuraService, private dataService: DataService) { }

  async bootstrapALEQ() {
    const ALEQAbstraction = await this.infuraService.artifactsToContract(ALEQData);
    this.ALEQInstance = await ALEQAbstraction.at(ALEQAddress);
    console.log(this.ALEQInstance);
    this.refreshVariables();
  }

  async refreshVariables() {
    setInterval(async () => {
      const pauseStatus = await this.ALEQInstance.isPaused.call();
      this.dataService.pauseStatusObservable.next(pauseStatus);

      const nameStatus = await this.ALEQInstance.name.call();
      this.dataService.nameStatusObservable.next(nameStatus);

      const symbolStatus = await this.ALEQInstance.symbol.call();
      this.dataService.symbolStatusObservable.next(symbolStatus);

      const totalSupplyStatus = await this.ALEQInstance.totalSupply.call();
      this.dataService.totalSupplyStatusObservable.next(totalSupplyStatus);

      const totalSharesStatus = await this.ALEQInstance.totalShares.call();
      this.dataService.totalSharesStatusObservable.next(totalSharesStatus);
    }, 1000);
  }
}
