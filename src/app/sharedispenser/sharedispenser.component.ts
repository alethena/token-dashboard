import { Component, OnInit } from '@angular/core';

export interface Contract {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sharedispenser',
  templateUrl: './sharedispenser.component.html',
  styleUrls: ['./sharedispenser.component.scss']
})
export class SharedispenserComponent implements OnInit {
  title = 'Alethena\'s Share Dispenser Dashboard';
  contracts: Contract[] = [
    {value: 'contract-0', viewValue: 'Quitt'},
    {value: 'contract-1', viewValue: 'Alethena'},
    {value: 'contract-2', viewValue: 'LEXR'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
