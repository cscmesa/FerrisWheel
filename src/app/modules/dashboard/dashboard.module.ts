import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BluetoothModule } from '../bluetooth/bluetooth.module';
import { ColorPickerModule } from '../color-picker/color-picker.module';
import { LoggerModule } from '../logger/logger.module';

import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    BluetoothModule,
    ColorPickerModule,
    LoggerModule
  ],
  exports: [
    BluetoothModule,
    ColorPickerModule,
    LoggerModule,
    DashboardComponent
  ]
})
export class DashboardModule { }
