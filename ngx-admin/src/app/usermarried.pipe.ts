import { Pipe, PipeTransform } from '@angular/core';
import { Globals } from './@core/data/globals';

@Pipe({
  name: 'usermarried'
})
export class UsermarriedPipe implements PipeTransform {

  constructor(private globals: Globals) {

  }
  transform(value: any, colName: string): any {
    // return this.globals.pipe[value];
    if (this.globals.pipe.hasOwnProperty(colName)) {
      return this.globals.pipe[colName][value];
    }

    return value;
  }

}




