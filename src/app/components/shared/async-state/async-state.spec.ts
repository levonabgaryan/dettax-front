import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncState } from './async-state';

describe('AsyncState', () => {
  let component: AsyncState;
  let fixture: ComponentFixture<AsyncState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncState],
    }).compileComponents();

    fixture = TestBed.createComponent(AsyncState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
