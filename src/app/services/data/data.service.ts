import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class DataService {
  // General Observables
  public web3Observable = new Subject < any > ();
  public accountsObservable = new Subject < any > ();
  public accountObservable = new Subject < any > ();
  public MMenabledObservable = new Subject < any > ();
  public selectedContractObservable = new Subject < any > ();
  public selectedToolObservable = new Subject < any > ();
  // Equity Contract
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
  // Share Dispenser Contract
  public SDcontractAddressObservable = new Subject < any > ();
  public SDownerAddressObservable = new Subject < any > ();
  public XCHFcontractAddressObservable = new Subject < any > ();
  public SDavailableSharesObservable = new Subject < any > ();
  public SDavailableXCHFObservable = new Subject < any > ();
  public SDminPriceObservable = new Subject < any > ();
  public SDmaxPriceObservable = new Subject < any > ();
  public SDslopeObservable = new Subject < any > ();
  public SDminVolumeObservable = new Subject < any > ();
  public SDbuySideStatusObservable = new Subject < any > ();
  public SDsellSideStatusObservable = new Subject < any > ();
  public SDpauseStatusObservable = new Subject < any > ();

  constructor() {}
}
