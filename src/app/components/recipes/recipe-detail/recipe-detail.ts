import { Component, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AsyncState } from '../../shared/async-state/async-state';
import { RECIPE_QUERY_SERVICE } from '../../../infrastructure/di/query-services';
import type { DevourRecipeQueryService } from '../../../infrastructure/json-api/query-services/recipe-query.service';
import type { RecipeResource } from '../../../infrastructure/json-api/resources/recipe';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [NgOptimizedImage, AsyncState, RouterLink],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail implements OnInit {
  private readonly recipeQueryService: DevourRecipeQueryService;
  private readonly route: ActivatedRoute;

  public readonly recipe: WritableSignal<RecipeResource | null>;
  public readonly isLoading: WritableSignal<boolean>;
  public readonly errorMessage: WritableSignal<string | null>;

  constructor(
    @Inject(RECIPE_QUERY_SERVICE) recipeQueryService: DevourRecipeQueryService,
    route: ActivatedRoute,
  ) {
    this.recipeQueryService = recipeQueryService;
    this.route = route;

    this.recipe = signal<RecipeResource | null>(null);
    this.isLoading = signal(false);
    this.errorMessage = signal<string | null>(null);
  }

  public async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Invalid recipe id');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      // getById() already includes `include=author,categories`
      const recipe = await this.recipeQueryService.getById(id);
      this.recipe.set(recipe);
    } catch (e) {
      this.errorMessage.set('Failed to load recipe. It might not exist.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
