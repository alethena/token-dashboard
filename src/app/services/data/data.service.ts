import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
providedIn: 'root'
})

export class DataService {
  public pauseStatusObservable = new Subject < any > ();
  public nameStatusObservable = new Subject < any > ();
  public symbolStatusObservable = new Subject < any > ();
  public totalSupplyStatusObservable = new Subject < any > ();
  public totalSharesStatusObservable = new Subject < any > ();
  public termsandconditionsObservable = new Subject < any > ();
  public collateralRateObservable = new Subject < any > ();
  public preClaimPeriodObservable = new Subject < any > ();
  public claimPeriodObservable = new Subject < any > ();
  public contractAddressObservable = new Subject < any > ();
  public ownerAddressObservable = new Subject < any > ();
  public masterAddressObservable = new Subject < any > ();
  public web3Observable = new Subject < any > ();
  public accountsObservable = new Subject < any > ();
  public accountObservable = new Subject < any > ();
  public MMenabledObservable = new Subject < any > ();
  public selectedContractObservable = new Subject < any > ();
  public selectedToolObservable = new Subject < any > ();
  public SDcontractAddressObservable = new Subject < any > ();
  public SDownerAddressObservable = new Subject < any > ();
  constructor() {}
}
