import { Component, Inject, OnInit, signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AsyncState } from '../../shared/async-state/async-state';
import { RECIPE_QUERY_SERVICE } from '../../../infrastructure/di/query-services';
import type { DevourRecipeQueryService } from '../../../infrastructure/json-api/query-services/recipe-query.service';
import type { RecipeResource } from '../../../infrastructure/json-api/resources/recipe';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [NgOptimizedImage, AsyncState, RouterLink],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss',
})
export class RecipeList implements OnInit {
  private readonly recipeQueryService: DevourRecipeQueryService;
  private readonly router: Router;
  private readonly route: ActivatedRoute;

  public readonly allRecipes = signal<RecipeResource[]>([]);
  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly pageNumber = signal(1);
  public readonly pageSize = signal(6);
  public readonly totalItems = signal(0);

  public readonly totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.pageSize()),
  );
  public readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

  constructor(
    @Inject(RECIPE_QUERY_SERVICE) recipeQueryService: DevourRecipeQueryService,
    router: Router,
    route: ActivatedRoute,
  ) {
    this.recipeQueryService = recipeQueryService;
    this.router = router;
    this.route = route;

    const pageFromUrl = this.route.snapshot.queryParamMap.get('page');
    this.pageNumber.set(pageFromUrl ? Number(pageFromUrl) : 1);
  }

  public async ngOnInit(): Promise<void> {
    await this.loadRecipes();
  }

  public async loadRecipes(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const result = await this.recipeQueryService.getAllPaged(
        this.pageNumber(),
        this.pageSize(),
      );
      this.allRecipes.set(result.data);
      this.totalItems.set(result.total);
    } catch (e) {
      this.errorMessage.set('Failed to load recipes.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  public async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.totalPages() || page === this.pageNumber()) return;

    this.pageNumber.set(page);

    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.pageNumber() },
      queryParamsHandling: 'merge',
    });

    await this.loadRecipes();
  }
}
