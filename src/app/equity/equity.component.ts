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
  public pauseStatus = false;
  public nameStatus = 'Loading';
  public symbolStatus = 'Loading';
  public totalSupplyStatus: number;
  public totalSharesStatus: number;
  public termsandconditions = 'Loading';
  public collateralRate = 'Loading';
  public preClaimPeriod = 'Loading';
  public claimPeriod = 'Loading';
  public contractAddress = 'Loading';
  public ownerAddress = 'Loading';
  public masterAddress = 'Loading';


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
      this.totalSupplyStatus = parseFloat(newTotalSupplyStatus);
    });
    this.dataService.totalSharesStatusObservable.subscribe((newTotalSharesStatus) => {
      this.totalSharesStatus = parseFloat(newTotalSharesStatus);
    });
    this.dataService.termsandconditionsObservable.subscribe((newTermsandConditions) => {
      this.termsandconditions = newTermsandConditions;
    });
    this.dataService.collateralRateObservable.subscribe((newCollateralRate) => {
      this.collateralRate = newCollateralRate;
    });
    this.dataService.preClaimPeriodObservable.subscribe((newPreClaimPeriod) => {
      this.preClaimPeriod = newPreClaimPeriod;
    });
    this.dataService.claimPeriodObservable.subscribe((newClaimPeriod) => {
      this.claimPeriod = newClaimPeriod;
    });
    this.dataService.contractAddressObservable.subscribe((newContractAddress) => {
      this.contractAddress = newContractAddress;
    });
    this.dataService.ownerAddressObservable.subscribe((newOwnerAddress) => {
      this.ownerAddress = newOwnerAddress;
    });
    this.dataService.masterAddressObservable.subscribe((newMasterAddress) => {
      this.masterAddress = newMasterAddress;
    });
  }

}
