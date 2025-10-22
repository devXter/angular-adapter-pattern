import { Component, input, InputSignal } from '@angular/core';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  users: InputSignal<User[]> = input.required<User[]>();
}
