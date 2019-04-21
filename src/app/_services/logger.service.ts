import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  log_history: BehaviorSubject<string> = new BehaviorSubject<string>('Welcome! Please connect to a BLE-enabled device to begin.');

  constructor() { }

  log(msg: any) {
    let str = new Date().toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ": " + JSON.stringify(msg);
    this.log_history.next(str);
  }


}
