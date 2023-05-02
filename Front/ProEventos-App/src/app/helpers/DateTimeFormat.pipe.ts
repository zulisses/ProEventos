import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../util/constants';

@Pipe({
  name: 'DateFormatPipe'
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    var month = value.substring(0, 2);
    var day = value.substring(3, 5);
    var year = value.substring(6, 10);
    var hour = value.substring(11, 13);
    var minutes = value.substring(14, 16);
    value = day + "/" + month + "/" + year + " " + hour + ":" + minutes;
    // alert(value.toLocaleString('en-US'));
    return super.transform(value, Constants.DATE_TIME_FMT);
  }

}
