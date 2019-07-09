import { Component, OnInit } from '@angular/core';

export interface Contract {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-claimtool',
  templateUrl: './claimtool.component.html',
  styleUrls: ['./claimtool.component.scss']
})
export class ClaimtoolComponent implements OnInit {
  title = 'Alethena\'s Reclaim Panel';
  contracts: Contract[] = [
    {value: 'contract-0', viewValue: 'Quitt'},
    {value: 'contract-1', viewValue: 'Alethena'},
    {value: 'contract-2', viewValue: 'LEXR'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
