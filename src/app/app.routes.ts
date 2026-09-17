import { Routes } from '@angular/router';
import { RecipeDetail } from './components/recipes/recipe-detail/recipe-detail';

export const routes: Routes = [
  { path: 'recipe', component: RecipeDetail },
  { path: '', redirectTo: '/recipe', pathMatch: 'full' },
];
