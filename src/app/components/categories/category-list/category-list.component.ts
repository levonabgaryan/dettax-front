import { Component, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AsyncState } from '../../shared/async-state/async-state';
import { Category } from '../../../core/domain/entities/category';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICategoryQueryService } from '../../../core/application/ports/query-services/category-query-service';
import { CATEGORY_QUERY_SERVICE } from '../../../infrastructure/di/query-services';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [NgOptimizedImage, AsyncState, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryList implements OnInit {
  private readonly categoryQueryService: ICategoryQueryService;
  private readonly router: Router;
  private readonly route: ActivatedRoute;

  public readonly allCategories: WritableSignal<Category[]>;
  public readonly isLoading: WritableSignal<boolean>;
  public readonly errorMessage: WritableSignal<string | null>;
  public readonly pageNumber: WritableSignal<number>;
  public readonly pageSize: WritableSignal<number>;

  constructor(
    @Inject(CATEGORY_QUERY_SERVICE) categoryQueryService: ICategoryQueryService,
    router: Router,
    route: ActivatedRoute,
  ) {
    this.categoryQueryService = categoryQueryService;
    this.router = router;
    this.route = route;

    this.allCategories = signal<Category[]>([]);
    this.isLoading = signal(false);
    this.errorMessage = signal<string | null>(null);
    this.pageSize = signal(10);

    const pageFromUrl = this.route.snapshot.queryParamMap.get('page');
    this.pageNumber = signal(pageFromUrl ? Number(pageFromUrl) : 1);
  }

  public async ngOnInit(): Promise<void> {
    await this.loadCategories();
  }

  public async loadCategories(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const categories = await this.categoryQueryService.getAllPaged(
        this.pageSize(),
        this.pageNumber(),
      );
      this.allCategories.set(categories);
    } catch (e) {
      this.errorMessage.set('Failed to load categories. Please try again later.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  public async nextPage(): Promise<void> {
    this.pageNumber.update((p) => p + 1);
    await this.updateUrlAndLoad();
  }

  public async prevPage(): Promise<void> {
    if (this.pageNumber() > 1) {
      this.pageNumber.update((p) => p - 1);
      await this.updateUrlAndLoad();
    }
  }

  private async updateUrlAndLoad(): Promise<void> {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.pageNumber() },
      queryParamsHandling: 'merge',
    });
    await this.loadCategories();
  }
}
