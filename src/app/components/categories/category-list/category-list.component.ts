import { Component, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesAreNotLoadedError } from '../../../core/application/errors/categories-are-not-loaded-error';
import { NgOptimizedImage } from '@angular/common';
import { AsyncState } from '../../shared/async-state/async-state';
import { ICategoryRepository } from '../../../core/application/ports/repositories/category-repository';
import { Category } from '../../../core/domain/entities/category';
import { CATEGORY_REPOSITORY } from '../../../infrastructure/di/repositories';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [NgOptimizedImage, AsyncState, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryList implements OnInit {
  private categoryRepository: ICategoryRepository;

  public allCategories: WritableSignal<Category[]>;
  public readonly isLoading: WritableSignal<boolean>;
  public readonly errorMessage: WritableSignal<string | null>;

  constructor(@Inject(CATEGORY_REPOSITORY) categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;

    this.allCategories = signal<Category[]>([]);
    this.isLoading = signal(false);
    this.errorMessage = signal<string | null>(null);
  }

  public async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      this.allCategories.set(await this.categoryRepository.getAll());
    } catch (e) {
      this.errorMessage.set(
        e instanceof CategoriesAreNotLoadedError ? 'Failed to load categories' : 'Unknown error',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected readonly console = console;
}
