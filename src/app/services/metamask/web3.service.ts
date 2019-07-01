import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import contract from 'truffle-contract';
import { DataService } from '../data/data.service';
declare let require: any;

const InfuraWebsocket = 'wss://rinkeby.infura.io/ws/v3/506b137aa0d543268e847d6affb7963c';

const Web3 = require('web3');

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  public web3: any;

  constructor(private dataService: DataService) {
    window.addEventListener('load', (event) => {
        this.bootstrapWeb3();
      });
   }

  public async bootstrapWeb3() {
    return new Promise(async (resolve, reject) => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.enable();
        } catch (error) {
          reject('User rejected connection');
        }
      } if ((typeof window.ethereum !== 'undefined') || (typeof window.web3 !== 'undefined')) {
        const provider = window['ethereum'] || window.web3.currentProvider;
        this.web3 = new Web3(provider);
        this.dataService.web3Observable.next(this.web3);
        resolve();
      } else {
        reject('MetaMask not available');
      }
    });
  }
  
  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;
  }

}
