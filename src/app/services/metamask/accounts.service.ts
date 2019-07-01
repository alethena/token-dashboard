import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  public accounts: string[];

  constructor(private web3Service: Web3Service, private dataService: DataService) {
    setInterval(() => this.bootstrapAccounts(), 100);
  }

  async bootstrapAccounts() {
    try {
      const accs = await this.web3Service.web3.eth.getAccounts();
      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        this.dataService.accountsObservable.next(accs);
        this.dataService.accountObservable.next(accs[0]);
        this.accounts = accs;
      }
    } catch (error) {
      // console.log('No accounts, not connected to MM');
    }
  }
}
