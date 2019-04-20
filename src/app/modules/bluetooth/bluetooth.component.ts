import { Component, OnInit } from '@angular/core';

import { BluetoothCore, BrowserWebBluetooth, ConsoleLoggerService } from '@manekinekko/angular-web-bluetooth';
import { BluetoothService } from '../../_services/bluetooth.service';

import { Subscription } from 'rxjs';

const PROVIDERS = [{
  provide: BluetoothCore,
  useFactory: (b, l) => new BluetoothCore(b, l),
  deps: [BrowserWebBluetooth, ConsoleLoggerService]
}, {
  provide: BluetoothService,
  useFactory: (b) => new BluetoothService(b),
  deps: [BluetoothCore]
}]

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.component.html',
  styleUrls: ['./bluetooth.component.scss'],
  providers: PROVIDERS
})
export class BluetoothComponent implements OnInit {

  value = null;
  valueSubscription: Subscription;
  streamSubscription: Subscription;
  deviceSubscription: Subscription;

  get device() {
    return this.bt.getDevice();
  }

  constructor(private bt: BluetoothService) {
    bt.config({
      decoder: (value: DataView) => value.getInt8(0),
      service: "battery_service",
      characteristic: "battery_level"
    })
  }

  ngOnInit() {
    this.getDeviceStatus();
    this.streamSubscription = this.bt.stream()
    .subscribe(this.updateValue.bind(this), this.hasError.bind(this))
  }


  getDeviceStatus() {
    this.bt.discover();
    this.deviceSubscription = this.bt.getDevice()
    .subscribe(device => {
      if(device) {
        this.value = null;
      } else {
        this.value = null;
      }
    }, this.hasError.bind(this))
  }

  requestValue() {
    this.valueSubscription = this.bt.value()
    .subscribe(null, this.hasError.bind(this))
  }

  updateValue(value: number) {
    console.log('Reading information... %d', value);
    this.value = value;
  }

  disconnect() {
    this.bt.disconnectDevice();
    this.deviceSubscription.unsubscribe();
    this.valueSubscription.unsubscribe();
  }

  hasError(error: string) {
    console.log(error);
  }

  ngOnDestroy() {
    this.valueSubscription.unsubscribe();
    this.deviceSubscription.unsubscribe();
    this.streamSubscription.unsubscribe();
  }


}
