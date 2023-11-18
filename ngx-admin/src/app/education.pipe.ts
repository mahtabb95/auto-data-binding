import { Pipe, PipeTransform } from '@angular/core';

import { Globals } from './@core/data/globals';

@Pipe({
  name: 'educationPipe'
})
export class EducationPipe implements PipeTransform {

  constructor(private globals: Globals) {

  }

  transform(value: number) {
    // console.log(this.globals.educations);
    return this.globals.educations[value];
  }
}
