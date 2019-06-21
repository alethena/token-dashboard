import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public pauseStatusObservable = new Subject<any>();
  public nameStatusObservable = new Subject<any>();
  public symbolStatusObservable = new Subject<any>();
  public totalSupplyStatusObservable = new Subject<any>();
  public totalSharesStatusObservable = new Subject<any>();
  constructor() { }
}
