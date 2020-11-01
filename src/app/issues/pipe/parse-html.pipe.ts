import { transformAll } from '@angular/compiler/src/render3/r3_ast';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
const htmlparser2 = require('htmlparser2');
@Pipe({
  name: 'parseHtml',
})
export class ParseHtmlPipe implements PipeTransform {
  constructor() {
    console.log('pipe');
  }
  parser = new htmlparser2.Parser({
    onopentag(name, attribs) {
      if (name === 'script' && attribs.type === 'text/javascript') {
        console.log('JS! Hooray!');
      }
    },
    ontext(text) {
      console.log('-->', text);
    },
    onclosetag(tagname) {
      if (tagname === 'script') {
        console.log("That's it?!");
      }
    },
  });

  transform(value: string) {
    console.log('transform:', this.parser.write(value));
    return this.parser.write(value);
  }
}
