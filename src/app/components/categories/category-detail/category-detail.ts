import { Component, Inject, OnInit, signal } from '@angular/core';
import { AsyncState } from '../../shared/async-state/async-state';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CATEGORY_QUERY_SERVICE } from '../../../infrastructure/di/query-services';
import type { DevourCategoryQueryService } from '../../../infrastructure/json-api/query-services/category-query.service';
import type { CategoryResource } from '../../../infrastructure/json-api/resources/category';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [AsyncState, NgOptimizedImage],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.scss',
})
export class CategoryDetail implements OnInit {
  private readonly categoryQueryService: DevourCategoryQueryService;
  private readonly route: ActivatedRoute;

  public readonly category = signal<CategoryResource | null>(null);
  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  constructor(
    @Inject(CATEGORY_QUERY_SERVICE) categoryQueryService: DevourCategoryQueryService,
    route: ActivatedRoute,
  ) {
    this.categoryQueryService = categoryQueryService;
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
      this.category.set(await this.categoryQueryService.getById(id));
    } catch (e) {
      this.errorMessage.set('Failed to load category. It might not exist.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
