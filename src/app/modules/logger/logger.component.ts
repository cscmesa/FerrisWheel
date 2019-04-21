import { Component, OnInit } from '@angular/core';

import { LoggerService } from '../../_services/logger.service';
import { scan } from 'rxjs/operators';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {

  logs: any;

  constructor(private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log_history
    .pipe(
      scan<string>((acc, curr) => [curr, ...acc], [])
    )
    .subscribe(logs => {
      this.logs = logs;
    });
  }

}
