import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe de ejemplo: Trunca texto a un largo específico
 * Uso: {{ longText | truncate:20:'...' }}
 */
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = '...'): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    if (completeWords) {
      limit = value.substring(0, limit).lastIndexOf(' ');
    }

    return value.substring(0, limit) + ellipsis;
  }
}
