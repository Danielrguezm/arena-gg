import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fmtNum', standalone: true, pure: true })
export class FmtNumPipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('es-ES').format(value);
  }
}
