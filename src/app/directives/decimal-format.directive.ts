import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDecimalFormat]',
})
export class DecimalFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const formattedValue = this.formatValue(value);
    this.el.nativeElement.value = formattedValue;
  }

  private formatValue(value: string): string {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = numericValue.split('.');

    // Format integer part with commas
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Return formatted value with two decimal points
    if (decimalPart !== undefined) {
      return `${formattedInteger}.${decimalPart.slice(0, 3)}`;
    } else {
      return formattedInteger;
    }
  }
}
