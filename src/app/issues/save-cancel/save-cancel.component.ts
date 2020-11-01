import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-save-cancel',
  templateUrl: './save-cancel.component.html',
  styleUrls: ['./save-cancel.component.css'],
})
export class SaveCancelComponent implements OnInit {
  constructor() {}

  // component will emit
  @Output()
  saveOps: EventEmitter<String> = new EventEmitter<String>();
  @Output()
  cancelOps: EventEmitter<String> = new EventEmitter<String>();

  ngOnInit(): void {}
}
