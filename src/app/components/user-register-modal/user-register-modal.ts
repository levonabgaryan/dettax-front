import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpUserService,
  RegisterUserRequest,
} from '../../infrastructure/services/http-user-service';
import { AuthService } from '../../infrastructure/services/auth.service';

@Component({
  selector: 'app-user-register-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-register-modal.html',
  styleUrls: ['./user-register-modal.scss'],
})
export class UserRegisterModalComponent {
  @Output() public closeModal = new EventEmitter<void>();
  @Output() public registrationSuccess = new EventEmitter<void>();

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly userService: HttpUserService = inject(HttpUserService);
  private readonly authService: AuthService = inject(AuthService);

  public isLoading = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  public registerForm: FormGroup = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public close(): void {
    this.closeModal.emit();
  }

  public async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      await this.userService.register(this.registerForm.getRawValue() as RegisterUserRequest);

      this.successMessage = 'Successfully registered! Redirecting to login...';
      this.registerForm.reset();

      setTimeout(() => {
        this.registrationSuccess.emit();
        this.close();
        this.authService.login();
      }, 2000);

    } catch (error: unknown) {
      console.error(error);

      if (error instanceof HttpErrorResponse) {
        if (error.status === 409) {
          this.errorMessage = 'A user with this email already exists.';
        } else if (error.status === 400 || error.status === 422) {
          this.errorMessage = 'Validation error. Please check the entered data.';
        } else {
          this.errorMessage = 'An error occurred during registration. Please try again later.';
        }
      } else {
        this.errorMessage = 'An unexpected error occurred. Please check your connection.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
