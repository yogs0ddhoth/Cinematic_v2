import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterRangeInputComponent } from './filter-range-input.component';

describe('FilterRangeInputComponent', () => {
  let component: FilterRangeInputComponent;
  let fixture: ComponentFixture<FilterRangeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterRangeInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterRangeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
