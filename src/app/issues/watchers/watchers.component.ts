import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-watchers',
  templateUrl: './watchers.component.html',
  styleUrls: ['./watchers.component.css'],
})
export class WatchersComponent implements OnInit {
  public visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public watchersCtrl = new FormControl();
  public filteredWatchers: Observable<string[]>;
  // input fields
  @Input() watchListOptions: Array<any>;
  @Input() existingWatchList: Array<any>;

  public currentWatchList = [];
  public updatedWatchList = [];
  // @Input() currentWatchList: Array<any>;
  // output , component will emit
  @Output()
  removeWatchers: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  updatedWatchers: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  addWatchers: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('watcherInput')
  watcherInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
    if (this.existingWatchList && this.existingWatchList.length > 0) {
      console.debug('constructur update');
      this.currentWatchList = this.existingWatchList;
    }
  }

  ngOnInit(): void {
    console.debug('nginit update');
    this.currentWatchList = this.existingWatchList;
  }

  public addWatcher(event: MatChipInputEvent): void {
    console.debug('add event', event);
    const input = event.input;
    const value = event.value;

    // Add watchers
    if ((value || '').trim()) {
      this.currentWatchList.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.watchersCtrl.setValue(null);
    console.debug('after addition , current watchlist,', this.currentWatchList);
  }

  public removeWatcher(watcher: string): void {
    console.debug('remove', watcher);

    const index = this.currentWatchList.indexOf(watcher);

    if (index >= 0) {
      this.currentWatchList.splice(index, 1);
    }
    this.updatedWatchList = [];
    this.updatedWatchList.push(watcher);
    console.debug('updated list removal:', this.updatedWatchList);
    // emitt removal event
    this.removeWatchers.emit(this.updatedWatchList[0]);
    console.debug('after removing', this.currentWatchList);
    console.debug('current watchlist', this.existingWatchList);
  }

  public selectedWatcher(event: MatAutocompleteSelectedEvent): void {
    // this.currentWatchList = [];
    this.currentWatchList.push(event.option.value);
    console.debug('after addition , current watchlist,', this.currentWatchList);
    this.updatedWatchList.push(event.option.value);
    // emit updated watchlist to parent component
    console.debug('updated list:', this.updatedWatchList);
    this.addWatchers.emit(this.updatedWatchList[0]);
    // this.updatedWatchers.emit(this.updatedWatchList);
    this.watcherInput.nativeElement.value = '';
    this.watchersCtrl.setValue(null);
  }
}
