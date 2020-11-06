import { transformAll } from '@angular/compiler/src/render3/r3_ast';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
const htmlparser2 = require('htmlparser2');
@Pipe({
  name: 'parseHtml',
})
export class ParseHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
    console.debug('pipe');
  }

  transform(value: string): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
