import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BluetoothComponent } from './bluetooth.component';


@NgModule({
  declarations: [BluetoothComponent],
  imports: [
    CommonModule
  ],
  exports: [BluetoothComponent],
  providers: []
})
export class BluetoothModule { }
