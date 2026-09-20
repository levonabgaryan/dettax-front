import { Component, input } from '@angular/core';

@Component({
  selector: 'app-async-state',
  standalone: true,
  imports: [],
  templateUrl: './async-state.html',
  styleUrl: './async-state.scss',
})
export class AsyncState {
  public readonly isLoading = input.required<boolean>();
  public readonly errorMessage = input<string | null>(null);
}
