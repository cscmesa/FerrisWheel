import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';

type ServiceOptions = {
  characteristic: string;
  service: string;
  decoder(value: DataView): number | {[key: string]: number}
};

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  private _config: ServiceOptions;

  constructor(public readonly ble: BluetoothCore) { }

  config(options: ServiceOptions) {
    this._config = options;
  }

  discover() {
    return this.ble.discover$();
  }

  getDevice() {
    return this.ble.getDevice$();
  }

  stream() {
    return this.ble.streamValues$()
    .pipe(
      map((value: DataView) => value.getInt8(0))
    )
  }

  disconnectDevice() {
    this.ble.disconnectDevice();
  }

  value() {
    console.log('Getting information...');

    return this.ble
    .value$({
      service: 'battery_service',
      characteristic: 'battery_level'
    });
  }
}
