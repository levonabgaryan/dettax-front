import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CreateRecipeDTO,
  IRecipeRepository,
} from '../../core/application/ports/repositories/recipe-repository';
import { RECIPE_REPOSITORY } from '../../infrastructure/di/repositories';
import { AuthService } from '../../infrastructure/services/auth.service';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: 'create-recipe-component.html',
  styleUrl: 'create-recipe-component.scss',
})
export class CreateRecipeComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly recipeRepository = inject<IRecipeRepository>(RECIPE_REPOSITORY);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public isSubmitting = false;
  public errorMessage: string | null = null;

  public recipeForm!: FormGroup;

  public ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', Validators.required],
      description: [''],
      imageUrl: [''],
      ingredients: this.fb.array([]),
    });

    this.addIngredient();
  }

  public get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  public addIngredient(): void {
    const ingredientForm = this.fb.group({
      name: ['', Validators.required],
      amount: [1, [Validators.required, Validators.min(0.1)]],
      unit: ['g', Validators.required],
    });
    this.ingredients.push(ingredientForm);
  }

  public removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.userId();
    if (!userId) {
      this.errorMessage = 'You must be logged in to create a recipe.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    try {
      const formValue = this.recipeForm.value;

      const dto: CreateRecipeDTO = {
        name: formValue.title,
        country: formValue.country,
        description: formValue.description,
        imageUrl: formValue.imageUrl,
        ingredients: formValue.ingredients,
        authorId: userId,
      };

      await this.recipeRepository.create(dto);

      await this.router.navigate(['/profile']);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof HttpErrorResponse) {
        this.errorMessage =
          error.error?.errors?.[0]?.detail || 'Failed to create recipe. Please check the data.';
      } else {
        this.errorMessage = 'An unexpected error occurred.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }
}
