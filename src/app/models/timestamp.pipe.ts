import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(value: any): string {
    if (value && value.toDate) {
      const datePipe = new DatePipe('en-US');
      const dateValue = value.toDate();
      return datePipe.transform(dateValue, 'medium') || ''; // Use the empty string if transformation fails
    }
    return '';
  }
}