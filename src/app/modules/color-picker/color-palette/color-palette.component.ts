import {
  Component,
  Input,
  Output,
  ElementRef,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
  ViewChild,
  EventEmitter,
  HostListener,
  Self } from '@angular/core';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss']
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {

  @Input() hue: string;

  @Output() color: EventEmitter<string> = new EventEmitter(true);

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @HostListener('window:mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    this.mousedown = false;
  }

  private ctx: CanvasRenderingContext2D;
  private mousedown: boolean = false;
  public selectedPosition: {x: number, y: number};

  constructor(@Self() private el: ElementRef) { }

  ngAfterViewInit() {
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['hue']) {
      this.draw();
      const pos = this.selectedPosition;
      if(pos) {
        this.color.emit(this.getColorAtPosition(pos.x, pos.y));
      }
    }
  }

  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d')
    }

    const width = this.el.nativeElement.offsetWidth;
    const height = this.el.nativeElement.offsetHeight;

    // const width = this.canvas.nativeElement.width;
    // const height = this.canvas.nativeElement.height;

    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;

    this.ctx.clearRect(0, 0, width, height);

    this.ctx.fillStyle = this.hue || 'rgba(255,255,255,1)'
    this.ctx.fillRect(0, 0, width, height)

    const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0)
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)')
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)')

    this.ctx.fillStyle = whiteGrad
    this.ctx.fillRect(0, 0, width, height)

    const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height)
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)')
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)')

    this.ctx.fillStyle = blackGrad
    this.ctx.fillRect(0, 0, width, height)

    if (this.selectedPosition) {
      this.ctx.strokeStyle = 'white'
      this.ctx.fillStyle = 'white'
      this.ctx.beginPath()
      this.ctx.arc(
        this.selectedPosition.x,
        this.selectedPosition.y,
        10,
        0,
        2 * Math.PI
      )
      this.ctx.lineWidth = 5
      this.ctx.stroke()
    }
  }

  onMouseDown(event: MouseEvent) {
    this.mousedown = true;
    this.selectedPosition = {x: event.offsetX, y: event.offsetY};
    this.draw();
    this.emitColor(event.offsetX, event.offsetY);
  }

  onMouseMove(event: MouseEvent) {
    if(this.mousedown) {
      this.selectedPosition = {x: event.offsetX, y: event.offsetY};
      this.draw();
      this.emitColor(event.offsetX, event.offsetY);
    }
  }

  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
  }

  getColorAtPosition(x: number, y: number) {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data;
    return `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, 1)`;
  }
}
