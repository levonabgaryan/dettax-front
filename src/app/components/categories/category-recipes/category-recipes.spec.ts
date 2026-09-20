import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryRecipes } from './category-recipes';

describe('CategoryRecipes', () => {
  let component: CategoryRecipes;
  let fixture: ComponentFixture<CategoryRecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryRecipes],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryRecipes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
