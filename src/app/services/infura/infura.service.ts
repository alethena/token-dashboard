import { Injectable } from '@angular/core';

declare let require: any;
const Web3 = require('web3');
import contract from 'truffle-contract';

@Injectable({
  providedIn: 'root'
})
export class InfuraService {
  public web3: any;

  constructor() { }

  public async bootstrapWeb3() {
    Web3.providers.WebsocketProvider.prototype.sendAsync = Web3.providers.WebsocketProvider.prototype.send;
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail);
    // rinkeby.infura.io/v3/2a59f4ddc9b14dd5b321f5fbee33f77d
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/506b137aa0d543268e847d6affb7963c'));
    console.log('Web3 instantiated');
  }

  public async artifactsToContract(artifacts) {
    try {
      const contractAbstraction = contract(artifacts);
      contractAbstraction.setProvider(this.web3.currentProvider);
      return contractAbstraction;
    } catch (error) {
      throw (error);
    }
  }

}
