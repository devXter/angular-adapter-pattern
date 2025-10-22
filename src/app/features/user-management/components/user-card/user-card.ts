import { Component, input, InputSignal } from '@angular/core';
import { User } from '../../../../core/models/user';
import { DatePipe, NgOptimizedImage, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-user-card',
  imports: [NgOptimizedImage, DatePipe, TitleCasePipe],
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

  protected getSourceBorderColor(): string {
    const borders = {
      github: 'border-purple-200 hover:border-purple-400',
      internal: 'border-blue-200 hover:border-blue-400',
      jsonplaceholder: 'border-green-200 hover:border-green-400',
      twitter: 'border-sky-200 hover:border-sky-400',
    };

    return borders[this.user().source];
  }

  protected getSourceGradient(): string {
    const gradients = {
      github: 'bg-gradient-to-r from-purple-500 to-purple-600',
      internal: 'bg-gradient-to-r from-blue-500 to-blue-600',
      jsonplaceholder: 'bg-gradient-to-r from-green-500 to-green-600',
      twitter: 'bg-gradient-to-r from-sky-500 to-sky-600',
    };

    return gradients[this.user().source];
  }

  protected getSourceRingColor(): string {
    const rings = {
      github: 'ring-purple-200',
      internal: 'ring-blue-200',
      jsonplaceholder: 'ring-green-200',
      twitter: 'ring-sky-200',
    };

    return rings[this.user().source];
  }

  protected getSourceIconBg(): string {
    const backgrounds = {
      github: 'bg-purple-600',
      internal: 'bg-blue-600',
      jsonplaceholder: 'bg-green-600',
      twitter: 'bg-sky-600',
    };

    return backgrounds[this.user().source];
  }

  protected getSourceLightBg(): string {
    const backgrounds = {
      github: 'bg-purple-50 border border-purple-100',
      internal: 'bg-blue-50 border border-blue-100',
      jsonplaceholder: 'bg-green-50 border border-green-100',
      twitter: 'bg-sky-50 border border-sky-100',
    };

    return backgrounds[this.user().source];
  }

  protected getSourceFooter(): string {
    const footers = {
      github: 'bg-purple-50 text-purple-700 group-hover:bg-purple-100',
      internal: 'bg-blue-50 text-blue-700 group-hover:bg-blue-100',
      jsonplaceholder: 'bg-green-50 text-green-700 group-hover:bg-green-100',
      twitter: 'bg-sky-50 text-sky-700 group-hover:bg-sky-100',
    };

    return footers[this.user().source];
  }

  protected getSourceIcon(): string {
    const icons = {
      github: '🟣',
      internal: '🔵',
      jsonplaceholder: '🟢',
      twitter: '🔵',
    };

    return icons[this.user().source];
  }
}
