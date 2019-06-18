import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public pauseStatusObservable = new Subject<any>();
  constructor() { }
}
