import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { UserRegisterModalComponent } from '../../user-register-modal/user-register-modal';
import { AuthService } from '../../../infrastructure/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, UserRegisterModalComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public readonly authService = inject(AuthService);
  public isRegisterModalOpen = false;
}
