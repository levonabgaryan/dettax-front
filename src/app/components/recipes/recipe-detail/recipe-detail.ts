import { Component, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Recipe } from '../../../core/domain/entities/recipe';
import { NgOptimizedImage } from '@angular/common';
import { AsyncState } from '../../shared/async-state/async-state';
import { IRecipeRepository } from '../../../core/application/ports/repositories/recipe-repository';
import { RECIPE_REPOSITORY } from '../../../infrastructure/di/repositories';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [NgOptimizedImage, AsyncState, RouterLink],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail implements OnInit {
  private readonly recipeRepository: IRecipeRepository;
  private readonly route: ActivatedRoute;

  public readonly recipe: WritableSignal<Recipe | null>;
  public readonly isLoading: WritableSignal<boolean>;
  public readonly errorMessage: WritableSignal<string | null>;

  constructor(
    @Inject(RECIPE_REPOSITORY) recipeRepository: IRecipeRepository,
    route: ActivatedRoute,
  ) {
    this.recipeRepository = recipeRepository;
    this.route = route;

    this.recipe = signal<Recipe | null>(null);
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
      const recipe = await this.recipeRepository.getById(id);
      this.recipe.set(recipe);
    } catch (e) {
      this.errorMessage.set('Failed to load recipe. It might not exist.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
