import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Directiva de ejemplo: Resalta un elemento al pasar el mouse
 * Uso: <div appHighlight [highlightColor]="'yellow'">Texto</div>
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  @Input() highlightColor = 'yellow';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
