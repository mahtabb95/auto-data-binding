import { Pipe, PipeTransform } from '@angular/core';
import { Globals } from './@core/data/globals';

@Pipe({
  name: 'statusPipe'
})
export class StatusPipe implements PipeTransform {

  constructor(private globals: Globals) {

  }

  transform(value: number): string {
    // console.log(this.globals.married);
    return this.globals.married[value];

  }
}