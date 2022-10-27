import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImdbTestComponent } from './imdb-test.component';

describe('ImdbTestComponent', () => {
  let component: ImdbTestComponent;
  let fixture: ComponentFixture<ImdbTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImdbTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImdbTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
