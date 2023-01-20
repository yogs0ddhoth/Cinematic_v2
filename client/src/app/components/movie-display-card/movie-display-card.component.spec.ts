import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDisplayCardComponent } from './movie-display-card.component';

describe('MovieDisplayCardComponent', () => {
  let component: MovieDisplayCardComponent;
  let fixture: ComponentFixture<MovieDisplayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieDisplayCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDisplayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
