import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submitReview()" #reviewForm="ngForm" class="space-y-4">
      <div>
        <label class="block text-gray-700 font-semibold">Ocena (1–5):</label>
        <input
          type="number"
          min="1"
          max="5"
          required
          [(ngModel)]="rating"
          name="rating"
          class="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label class="block text-gray-700 font-semibold">Komentar:</label>
        <textarea
          required
          [(ngModel)]="comment"
          name="comment"
          rows="3"
          class="border rounded p-2 w-full"
        ></textarea>
      </div>

      <button
        type="submit"
        [disabled]="!reviewForm.valid"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
      >
        Pošalji
      </button>
    </form>
  `,
})
export class ReviewFormComponent {
  @Output() reviewSubmit = new EventEmitter<{ rating: number; comment: string }>();

  rating: number = 1;
  comment: string = '';

  submitReview() {
    if (this.comment.trim()) {
      this.reviewSubmit.emit({
        rating: this.rating,
        comment: this.comment,
      });
    }
  }
}
