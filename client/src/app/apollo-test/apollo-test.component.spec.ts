import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApolloTestComponent } from './apollo-test.component';

describe('ApolloTestComponent', () => {
  let component: ApolloTestComponent;
  let fixture: ComponentFixture<ApolloTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApolloTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApolloTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
