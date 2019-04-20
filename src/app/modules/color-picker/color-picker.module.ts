import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorSliderComponent } from './color-slider/color-slider.component';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { ColorPickerComponent } from './color-picker.component';

@NgModule({
  declarations: [ColorSliderComponent, ColorPaletteComponent, ColorPickerComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ColorPickerComponent
  ]
})
export class ColorPickerModule { }
