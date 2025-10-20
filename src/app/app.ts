import { Component } from '@angular/core';
import { UserManagement } from './features/user-management/user-management';

@Component({
  selector: 'app-root',
  imports: [UserManagement],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
