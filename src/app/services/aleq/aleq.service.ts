import { Injectable } from '@angular/core';
import { InfuraService } from '../infura/infura.service';
import { DataService } from '../data/data.service';
import { Web3Service } from '../metamask/web3.service';

declare var require: any;
const BN = require('bn.js');

const ALEQData = require('../../../../helpers/ALEQ.json');
const ALEQAddress = '0x40A1BE7f167C7f14D7EDE17972bC7c87b91e1D91';
// const SDAddress = '0xD091951A17030Aee1C0ab1319D6876048253bdc3';

@Injectable({ providedIn: 'root' })

export class AleqService {
  ALEQInstance: any;
  contractAddress: any;

  constructor(
    private infuraService: InfuraService,
    private dataService: DataService,
    private web3Service: Web3Service) { }

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

      const termsandconditions = await this.ALEQInstance.termsAndConditions.call();
      this.dataService.termsandconditionsObservable.next(termsandconditions);

      const collateralRate = await this.ALEQInstance.collateralRate.call();
      this.dataService.collateralRateObservable.next(collateralRate);

      const preClaimPeriod = await this.ALEQInstance.preClaimPeriod.call();
      this.dataService.preClaimPeriodObservable.next(preClaimPeriod);

      const claimPeriod = await this.ALEQInstance.claimPeriod.call();
      this.dataService.claimPeriodObservable.next(claimPeriod);

      const contractAddress = await this.ALEQInstance.address;
      this.dataService.contractAddressObservable.next(contractAddress);

      const ownerAddress = await this.ALEQInstance.owner.call();
      this.dataService.ownerAddressObservable.next(ownerAddress);

      const masterAddress = await this.ALEQInstance.master.call();
      this.dataService.masterAddressObservable.next(masterAddress);
    }, 1000);
  }
  // async allowance(amount, numberOfShares, user) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
  //       const ALEQInstance = await ALEQAbstraction.at(ALEQAddress);
  //       const numberOfSharesBN = new BN(numberOfShares);
  //       const approveTx = await ALEQInstance.approve
  //       .sendTransaction(SDAddress, numberOfSharesBN.toString(), { from: user, gasPrice: 20 * 10 ** 9 });
  //       console.log(approveTx.tx);
  //     } catch (error) {
  //       console.log(error);
  //       reject(error);
  //     }
  //   });
  // }
  async minting(shareholderAddress, numberOfShares, messageMinting, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(ALEQAddress);
        const numberOfSharesBN = new BN(numberOfShares);
        const mintingTx = await ALEQInstance.mint
        .sendTransaction(shareholderAddress, numberOfSharesBN.toString(),
        messageMinting, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        console.log(mintingTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  async unminting(numberOfShares, messageUnminting, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(ALEQAddress);
        const numberOfSharesBN = new BN(numberOfShares);
        const unmintingTx = await ALEQInstance.unmint.sendTransaction(numberOfSharesBN.toString(),
        messageUnminting, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        console.log(unmintingTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  async pausing(fromBlock, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(ALEQAddress);
        const messagePausing = 'Pausing contract.';
        const pausingFlag = true;
        const pausingTx = await ALEQInstance.pause
        .sendTransaction(pausingFlag, messagePausing, ALEQAddress, fromBlock, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        console.log(pausingTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  async unpausing(fromBlock, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(ALEQAddress);
        const messageUnpausing = 'Unpausing contract.';
        const pausingFlag = false;
        const unpausingTx = await ALEQInstance.pause
        .sendTransaction(pausingFlag, messageUnpausing, ALEQAddress, fromBlock, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        console.log(unpausingTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  async setTotalShares(numberOfShares, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(ALEQAddress);
        const numberOfSharesBN = new BN(numberOfShares);
        const totalSharesTx = await ALEQInstance.setTotalShares
        .sendTransaction(numberOfSharesBN.toString(), { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        console.log(totalSharesTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
