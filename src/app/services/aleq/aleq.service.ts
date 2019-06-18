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
    this.refreshVariables();
  }

  async refreshVariables() {
    setInterval(async () => {
      const pauseStatus = await this.ALEQInstance.isPaused.call();
      this.dataService.pauseStatusObservable.next(pauseStatus);
    }, 1000);
  }
}
