import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit {
  @Input() hideFlag: boolean;
  @Input() data: any;
  @Input() type: string;

  // component will emit
  @Output()
  changeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  saveOperation: EventEmitter<String> = new EventEmitter<String>();
  @Output()
  cancelOperation: EventEmitter<String> = new EventEmitter<String>();

  constructor() {}

  ngOnInit(): void {}

  public onChange(value): any {
    this.changeEvent.emit(value);
  }
}
