import { Component, Inject, OnInit, signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AsyncState } from '../../shared/async-state/async-state';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CATEGORY_QUERY_SERVICE } from '../../../infrastructure/di/query-services';
import type { DevourCategoryQueryService } from '../../../infrastructure/json-api/query-services/category-query.service';
import type { CategoryResource } from '../../../infrastructure/json-api/resources/category';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [NgOptimizedImage, AsyncState, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryList implements OnInit {
  private readonly categoryQueryService: DevourCategoryQueryService;
  private readonly router: Router;
  private readonly route: ActivatedRoute;

  public readonly allCategories = signal<CategoryResource[]>([]);
  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly pageNumber = signal(1);
  public readonly pageSize = signal(6);
  public readonly totalItems = signal(0);

  public readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  public readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

  constructor(
    @Inject(CATEGORY_QUERY_SERVICE) categoryQueryService: DevourCategoryQueryService,
    router: Router,
    route: ActivatedRoute,
  ) {
    this.categoryQueryService = categoryQueryService;
    this.router = router;
    this.route = route;

    const pageFromUrl = this.route.snapshot.queryParamMap.get('page');
    this.pageNumber.set(pageFromUrl ? Number(pageFromUrl) : 1);
  }

  public async ngOnInit(): Promise<void> {
    await this.loadCategories();
  }

  public async loadCategories(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const result = await this.categoryQueryService.getAllPaged(
        this.pageNumber(),
        this.pageSize(),
      );
      this.allCategories.set(result.data);
      this.totalItems.set(result.total);
    } catch (e) {
      this.errorMessage.set('Failed to load categories.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  public async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.totalPages() || page === this.pageNumber()) return;

    this.pageNumber.set(page);
    await this.updateUrlAndLoad();
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
