import { Component, inject } from '@angular/core';
import { UiState } from '../../services/ui-state';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  protected readonly uiState = inject(UiState);
}
