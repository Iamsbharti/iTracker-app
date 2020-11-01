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

  public save(): any {
    console.log('save ops in save-cancel comp');
    this.saveOps.emit();
  }
  public cancel(): any {
    console.log('cancel ops in save-cancel comp');
    this.cancelOps.emit();
  }
}