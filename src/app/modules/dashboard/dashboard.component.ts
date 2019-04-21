import { Component, OnInit } from '@angular/core';
import { BluetoothService } from '../../_services/bluetooth.service';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private device: boolean = false;

  constructor(private bt: BluetoothService) { }

  ngOnInit() {
    this.bt.device$
    .pipe(
      map(device => device ? true : false)
    )
    .subscribe(device => {
      this.device = device;
    })
  }

}
