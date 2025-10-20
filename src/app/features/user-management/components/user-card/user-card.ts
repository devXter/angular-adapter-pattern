import { Component, input, InputSignal } from '@angular/core';
import { User } from '../../../../core/models/user';
import { DatePipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-user-card',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {
  user: InputSignal<User> = input.required<User>();

  protected getSourceBadgeColor(): string {
    const colors = {
      github: 'bg-purple-100 text-purple-800',
      internal: 'bg-blue-100 text-blue-800',
      jsonplaceholder: 'bg-green-100 text-green-800',
      twitter: 'bg-sky-100 text-sky-800',
    };

    return colors[this.user().source];
  }
}
