import { Component, OnInit } from '@angular/core';

import { BluetoothCore, BrowserWebBluetooth, ConsoleLoggerService } from '@manekinekko/angular-web-bluetooth';
import { BluetoothService } from '../../_services/bluetooth.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.component.html',
  styleUrls: ['./bluetooth.component.scss']
})
export class BluetoothComponent implements OnInit {

  value = null;
  valueSubscription: Subscription;
  streamSubscription: Subscription;
  deviceSubscription: Subscription;

  get device() {
    return this.bt.device$;
  }

  constructor(private bt: BluetoothService) {
    bt.config({
      decoder: (value: DataView) => value.getInt8(0),
      service: "battery_service",
      characteristic: "battery_level"
    })
  }

  ngOnInit() {
    // this.getDeviceStatus();
    // this.streamSubscription = this.bt.stream()
    // .subscribe(this.updateValue.bind(this), this.hasError.bind(this))
  }

  connect() {
    this.bt.connect();
  }

  sendValue(data) {
    this.bt.send(data);
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
    this.bt.disconnect();
    // this.deviceSubscription.unsubscribe();
    // this.valueSubscription.unsubscribe();
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
