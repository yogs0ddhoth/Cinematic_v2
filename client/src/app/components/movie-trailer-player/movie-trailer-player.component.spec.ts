import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieTrailerPlayerComponent } from './movie-trailer-player.component';

describe('MovieTrailerPlayerComponent', () => {
  let component: MovieTrailerPlayerComponent;
  let fixture: ComponentFixture<MovieTrailerPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieTrailerPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieTrailerPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
