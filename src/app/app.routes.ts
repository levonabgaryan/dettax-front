import { Routes } from '@angular/router';
import { RecipeDetail } from './components/recipes/recipe-detail/recipe-detail';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: 'recipe', component: RecipeDetail },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
];
