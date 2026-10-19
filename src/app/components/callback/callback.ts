import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../infrastructure/services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `<p style="text-align:center; margin-top: 5rem;">Logging in...</p>`,
})
export class CallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  public async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const error = params['error'];

      if (code) {
        this.authService.handleCallback(code);
      } else if (error) {
        console.error('Authorization error:', error);
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
