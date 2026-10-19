import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AsyncState } from '../shared/async-state/async-state';
import { RECIPE_QUERY_SERVICE } from '../../infrastructure/di/query-services';
import { RECIPE_REPOSITORY } from '../../infrastructure/di/repositories';
import type { DevourRecipeQueryService } from '../../infrastructure/json-api/query-services/recipe-query.service';
import type { IRecipeRepository } from '../../core/application/ports/repositories/recipe-repository';
import type { RecipeResource } from '../../infrastructure/json-api/resources/recipe';
import { AuthService } from '../../infrastructure/services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [NgOptimizedImage, AsyncState, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfile implements OnInit {
  private readonly recipeQueryService = inject<DevourRecipeQueryService>(RECIPE_QUERY_SERVICE);
  private readonly recipeRepository = inject<IRecipeRepository>(RECIPE_REPOSITORY);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly myRecipes = signal<RecipeResource[]>([]);
  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly pageNumber = signal(1);
  public readonly pageSize = signal(6);
  public readonly totalItems = signal(0);

  public readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
  public readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

  public async ngOnInit(): Promise<void> {
    await this.loadMyRecipes();
  }

  public async loadMyRecipes(): Promise<void> {
    const userId = this.authService.userId();
    if (!userId) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const result = await this.recipeQueryService.getByAuthorId(
        userId,
        this.pageNumber(),
        this.pageSize(),
      );
      this.myRecipes.set(result.data);
      this.totalItems.set(result.total);
    } catch (e) {
      this.errorMessage.set('Failed to load your recipes.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  public async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.totalPages() || page === this.pageNumber()) return;

    this.pageNumber.set(page);
    await this.loadMyRecipes();
  }

  public async deleteRecipe(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    this.isLoading.set(true);
    try {
      await this.recipeRepository.delete(id);

      if (this.myRecipes().length === 1 && this.pageNumber() > 1) {
        this.pageNumber.update((p) => p - 1);
      }

      await this.loadMyRecipes();
    } catch (e) {
      alert('Failed to delete recipe.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  public editRecipe(id: string): void {
    this.router.navigate(['/recipes', id, 'edit']);
  }
}
