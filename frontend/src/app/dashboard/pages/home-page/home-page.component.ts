import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthStatus } from '../../../auth/interfaces/auth-status.enum';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../interfaces/user-response.interface';

@Component({
  selector: 'dashboard-home-page',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterOutlet,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  public authStatus: AuthStatus;
  public currenId?: string;
  public user?: UserResponse | null;

  constructor() {
    this.authStatus = this.authService.authStatus();
    this.currenId = this.authService.currentId();
  }

  ngOnInit(): void {
    this.userService.getUser(this.currenId!).subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
  }
}
