import { Routes } from '@angular/router';
import { RecipeDetail } from './components/recipes/recipe-detail/recipe-detail';
import { CategoryList } from './components/categories/category-list/category-list.component';
import { CategoryDetail } from './components/categories/category-detail/category-detail';
import { CategoryRecipes } from './components/categories/category-recipes/category-recipes';
import { RecipeList } from './components/recipes/recipe-list/recipe-list.component';

export const routes: Routes = [
  { path: 'recipes', component: RecipeList },
  { path: 'recipe/:id', component: RecipeDetail },
  { path: 'categories', component: CategoryList },
  { path: 'category/:id', component: CategoryDetail },
  { path: 'category/:id/recipes', component: CategoryRecipes },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', redirectTo: '/categories' },
  { path: '**', redirectTo: '/categories' },
];
