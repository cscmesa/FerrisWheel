import { Component, OnInit } from '@angular/core';
import { BluetoothCore, BrowserWebBluetooth, ConsoleLoggerService } from '@manekinekko/angular-web-bluetooth';
import { BluetoothService } from '../../_services/bluetooth.service';

import { Observable } from 'rxjs';

// const PROVIDERS = [{
//   provide: BluetoothCore,
//   useFactory: (b, l) => new BluetoothCore(b, l),
//   deps: [BrowserWebBluetooth, ConsoleLoggerService]
// }, {
//   provide: BluetoothService,
//   useFactory: (b) => new BluetoothService(b),
//   deps: [BluetoothCore]
// }]

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  public hue: string;
  public color: string;

  device: Observable<BluetoothDevice>;

  constructor(private bt: BluetoothService) {
    this.device = this.bt.device$;
  }

  ngOnInit() {
  }

  // Sends data via bluetooth in the form of 'RGB' with the values for each being '1' or '0'
  sendColor(color) {
    this.bt.send(`c${color}`);
  }

  sendColorGradient(color) {
    this.bt.send(`d${color}`);
  }

}
