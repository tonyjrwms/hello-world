import { Component, inject } from '@angular/core';
import { UiState } from '../../services/ui-state';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly uiState = inject(UiState);
}
