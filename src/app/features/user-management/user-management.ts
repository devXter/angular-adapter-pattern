import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { UserData } from './services/user-data';
import { User } from '../../core/models/user';
import { UserCard } from './components/user-card/user-card';

@Component({
  selector: 'app-user-management',
  imports: [UserCard],
  providers: [UserData],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagement implements OnInit {
  private readonly userDataService: UserData = inject(UserData);

  protected readonly users: Signal<User[]> = this.userDataService.allUsers;

  ngOnInit(): void {
    this.userDataService.loadMockData();
  }
}
