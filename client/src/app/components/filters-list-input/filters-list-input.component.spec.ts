import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersListInputComponent } from './filters-list-input.component';

describe('FiltersListInputComponent', () => {
  let component: FiltersListInputComponent;
  let fixture: ComponentFixture<FiltersListInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersListInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersListInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
