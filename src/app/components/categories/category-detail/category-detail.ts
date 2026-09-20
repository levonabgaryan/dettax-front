import { Component, Inject, OnInit, signal } from '@angular/core';
import { Category } from '../../../core/domain/entities/category';
import { AsyncState } from '../../shared/async-state/async-state';
import { NgOptimizedImage } from '@angular/common';
import { ICategoryRepository } from '../../../core/application/ports/repositories/category-repository';
import { ActivatedRoute } from '@angular/router';
import { CATEGORY_REPOSITORY } from '../../../infrastructure/di/repositories';
import { CategoriesAreNotLoadedError } from '../../../core/application/errors/categories-are-not-loaded-error';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [AsyncState, NgOptimizedImage],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.scss',
})
export class CategoryDetail implements OnInit {
  public readonly category = signal<Category | null>(null);
  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  private readonly categoryRepository: ICategoryRepository;
  private readonly route: ActivatedRoute;

  constructor(
    @Inject(CATEGORY_REPOSITORY) categoryRepository: ICategoryRepository,
    route: ActivatedRoute, // ?
  ) {
    this.categoryRepository = categoryRepository;
    this.route = route;
  }

  public async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(id)) {
      this.errorMessage.set('Invalid category id');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      this.category.set(await this.categoryRepository.getById(id));
    } catch (e) {
      this.errorMessage.set(
        e instanceof CategoriesAreNotLoadedError ? 'Failed to load category' : 'Unknown error',
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
