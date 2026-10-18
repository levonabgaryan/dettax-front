import { Component, Inject, OnInit, signal } from '@angular/core';
import { Category } from '../../../core/domain/entities/category';
import { Recipe } from '../../../core/domain/entities/recipe';
import { ICategoryRepository } from '../../../core/application/ports/repositories/category-repository';
import { IRecipeQueryService } from '../../../core/application/ports/query-services/recipe-query-service';
import { CATEGORY_REPOSITORY } from '../../../infrastructure/di/repositories';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncState } from '../../shared/async-state/async-state';
import { NgOptimizedImage } from '@angular/common';
import { RECIPE_QUERY_SERVICE } from '../../../infrastructure/di/query-services';

@Component({
  selector: 'app-category-recipes',
  standalone: true,
  imports: [AsyncState, NgOptimizedImage, RouterLink],
  templateUrl: './category-recipes.html',
  styleUrl: './category-recipes.scss',
})
export class CategoryRecipes implements OnInit {
  public readonly category = signal<Category | null>(null);
  public readonly recipes = signal<Recipe[]>([]);
  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  private readonly categoryRepository: ICategoryRepository;
  private readonly recipeQueryService: IRecipeQueryService;
  private readonly route: ActivatedRoute;

  constructor(
    @Inject(CATEGORY_REPOSITORY) categoryRepository: ICategoryRepository,
    @Inject(RECIPE_QUERY_SERVICE) recipeQueryService: IRecipeQueryService,
    route: ActivatedRoute,
  ) {
    this.categoryRepository = categoryRepository;
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
      const category = await this.categoryRepository.getById(id);
      this.category.set(category);

      if (category) {
        const pageSize = 50;
        const pageNumber = 1;

        const recipes = await this.recipeQueryService.getAllByCategoryPaged(
          category,
          pageSize,
          pageNumber,
        );
        this.recipes.set(recipes);
      }
    } catch (error) {
      this.errorMessage.set('Failed to load related recipes.');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
