import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable error display component
 * Shows error message with optional action button
 */
@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container">
      <div class="error-icon">❌</div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button
        *ngIf="actionLabel"
        class="btn-secondary"
        (click)="action.emit()">
        {{ actionLabel }}
      </button>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      min-height: 200px;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    h3 {
      color: #e74c3c;
      margin-bottom: 0.5rem;
    }

    p {
      color: #666;
      margin-bottom: 1.5rem;
      max-width: 500px;
    }

    .btn-secondary {
      padding: 0.5rem 1rem;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.95rem;
      transition: background-color 0.2s;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
    }
  `]
})
export class ErrorComponent {
  @Input() title = 'Error';
  @Input() message = 'An error occurred';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}
