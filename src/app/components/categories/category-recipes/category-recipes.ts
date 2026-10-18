import { Component, Inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

import { AsyncState } from '../../shared/async-state/async-state';
import { CATEGORY_QUERY_SERVICE } from '../../../infrastructure/di/query-services';
import { RECIPE_QUERY_SERVICE } from '../../../infrastructure/di/query-services';

import type { DevourCategoryQueryService } from '../../../infrastructure/json-api/query-services/category-query.service';
import type { DevourRecipeQueryService } from '../../../infrastructure/json-api/query-services/recipe-query.service';
import type { CategoryResource } from '../../../infrastructure/json-api/resources/category';
import type { RecipeResource } from '../../../infrastructure/json-api/resources/recipe';

@Component({
  selector: 'app-category-recipes',
  standalone: true,
  imports: [AsyncState, NgOptimizedImage, RouterLink],
  templateUrl: './category-recipes.html',
  styleUrl: './category-recipes.scss',
})
export class CategoryRecipes implements OnInit {
  private readonly categoryQueryService: DevourCategoryQueryService;
  private readonly recipeQueryService: DevourRecipeQueryService;
  private readonly route: ActivatedRoute;

  public readonly category = signal<CategoryResource | null>(null);
  public readonly recipes = signal<RecipeResource[]>([]);
  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  constructor(
    @Inject(CATEGORY_QUERY_SERVICE) categoryQueryService: DevourCategoryQueryService,
    @Inject(RECIPE_QUERY_SERVICE) recipeQueryService: DevourRecipeQueryService,
    route: ActivatedRoute,
  ) {
    this.categoryQueryService = categoryQueryService;
    this.recipeQueryService = recipeQueryService;
    this.route = route;
  }

  public async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Invalid category id');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const category = await this.categoryQueryService.getById(id);
      this.category.set(category);

      const pageNumber = 1;
      const pageSize = 50;
      const result = await this.recipeQueryService.getByCategoryId(id, pageNumber, pageSize);

      this.recipes.set(result.data);
    } catch (error) {
      this.errorMessage.set('Failed to load related recipes.');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
