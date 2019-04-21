import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { LoggerService } from './logger.service';

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
  private device_cache: BluetoothDevice = null;
  private characteristic_cache: BluetoothRemoteGATTCharacteristic = null;

  device: Subject<BluetoothDevice> = new Subject<BluetoothDevice>();
  device$: Observable<BluetoothDevice> = this.device.asObservable();

  private readBuffer: string = "";

  constructor(public readonly ble: BluetoothCore, public logger: LoggerService) {
  }

  config(options: ServiceOptions) {
    this._config = options;
  }

  connect() {
    return (
      this.device_cache ? Promise.resolve(this.device_cache) :
          this.requestBluetoothDevice()
          .then((device: BluetoothDevice) =>
                this.connectDeviceAndCacheCharacteristic(device))
          .then((characteristic: BluetoothRemoteGATTCharacteristic) =>
                this.startNotifications(characteristic))
          .catch(console.error));
  }

  requestBluetoothDevice() {
    return navigator.bluetooth.requestDevice({
      filters: [{services: [0xFFE0]}]
    })
    .then(device => {
      this.logger.log(`Connected to '${device.name}'`);
      this.device.next(device);
      return device;
    })

  }

  connectDeviceAndCacheCharacteristic(device: BluetoothDevice) {
    if(device.gatt.connected && this.characteristic_cache) {
      return Promise.resolve(this.characteristic_cache)
    }

    return device.gatt.connect()
    .then((server: BluetoothRemoteGATTServer) => {
        this.logger.log('GATT server connected, getting service...');
        return server.getPrimaryService(0xFFE0);
    })
    .then((service: BluetoothRemoteGATTService) => {
        this.logger.log('Service found, getting characteristic...');
        return service.getCharacteristic(0xFFE1)
    })
    .then((characteristic: BluetoothRemoteGATTCharacteristic) => {
      this.characteristic_cache = characteristic;
      return this.characteristic_cache;
    })
  }

  startNotifications(characteristic: BluetoothRemoteGATTCharacteristic) {
    this.logger.log('Starting notifications...');
    return characteristic.startNotifications()
    .then(() => {
      this.logger.log('Notifications started.');
      characteristic
      .addEventListener('characteristicvaluechanged', () => {
        let value = new TextDecoder().decode((<any>event.target).value);
        for(let c of value) {
          if (c === '\n') {
            let data = this.readBuffer.trim();
            this.readBuffer = "";

            if(data !== undefined && data !== null) {
              console.log(data);
              this.logger.log(data);
            }
          } else {
            this.readBuffer += c;
          }
        }
      });
    })
  }

  disconnect() {
    if(this.device_cache) {
      this.logger.log(`Disconnecting from ${this.device_cache.name}`);
      if(this.device_cache.gatt.connected) {
        this.device_cache.gatt.disconnect();
        console.log(`${this.device_cache.name} disconnected.`);
      }
    }

    if(this.characteristic_cache) {
      this.characteristic_cache
      .removeEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged);

      this.characteristic_cache = null;
    }

    this.device_cache = null;
    this.device.next(null);
  }

  handleCharacteristicValueChanged(event) {
    let value = new TextDecoder().decode(event.target.value);
    for(let c of value) {
      if (c === '\n') {
        let data = this.readBuffer.trim();
        this.readBuffer = "";

        if(data !== undefined && data !== null) {
          console.log(data);
          this.logger.log(data);
        }
      } else {
        this.readBuffer += c;
      }
    }
  }

  send(data) {
    data = String(data);
    console.log("Data being sent", data);
    if(!data || !this.characteristic_cache) {
      return;
    }

    if(data.length > 20) {
      console.log('long');
      let chunks = data.match(/(.|[\r\n]){1,20}/g);
      this.writeToCharacteristic(this.characteristic_cache, chunks[0]);

      for(let i = 1; i < chunks.length; i++) {
        setTimeout(() => {
          this.writeToCharacteristic(this.characteristic_cache, chunks[i]);
        }, i * 100);
      }
    } else {
      this.writeToCharacteristic(this.characteristic_cache, data);
    }
  }

  writeToCharacteristic(characteristic: BluetoothRemoteGATTCharacteristic, data: string) {
    characteristic.writeValue(new TextEncoder().encode(data));
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
      service: this._config.service,
      characteristic: this._config.characteristic
    });
  }
}
