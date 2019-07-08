import { Component } from '@angular/core';

export interface Contract {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Alethena\'s Token Dashboard';
  contracts: Contract[] = [
    {value: 'contract-0', viewValue: 'Quitt'},
    {value: 'contract-1', viewValue: 'Alethena'},
    {value: 'contract-2', viewValue: 'LEXR'}
  ];
}
