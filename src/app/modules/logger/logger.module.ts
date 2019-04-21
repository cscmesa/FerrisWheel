import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggerComponent } from './logger.component';
import { LoggerService } from '../../_services/logger.service';

@NgModule({
  declarations: [LoggerComponent],
  imports: [
    CommonModule
  ],
  exports: [LoggerComponent],
  providers: [LoggerService]
})
export class LoggerModule { }
