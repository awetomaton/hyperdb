import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'basename' })
export class BasenamePipe implements PipeTransform {
  transform(path: string) {
    return path.split(/[\\/]/).pop();
  }
}