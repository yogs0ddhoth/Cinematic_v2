import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-filters-list-input',
  templateUrl: './filters-list-input.component.html',
  styleUrls: ['./filters-list-input.component.css']
})
export class FiltersListInputComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() name!: string;
  filterCtrl = new FormControl('');
  filteredFilters: Observable<string[]>;
  @Input() filters: string[] = [];
  @Input() allFilters!: string[];

  @Output() filtersChange = new EventEmitter<string[]>();

  @ViewChild('filterInput')
  filterInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.filteredFilters = this.filterCtrl.valueChanges.pipe(
      startWith(null),
      map((filter: string | null) => (filter ? this.#filter(filter) : this.allFilters.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add filter to the list
    if (value) {
      this.filters.push(value);
      this.filtersChange.emit(this.filters);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.filterCtrl.setValue(null);
  }

  remove(filter: string): void {
    const index = this.filters.indexOf(filter);

    if (index >= 0) {
      this.filters.splice(index, 1);
      this.filtersChange.emit(this.filters);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.filters.push(event.option.viewValue);
    this.filtersChange.emit(this.filters);
    this.filterInput.nativeElement.value = '';
    this.filterCtrl.setValue(null);
  }

  #filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFilters.filter(filter => filter.toLowerCase().includes(filterValue));
  }
}
