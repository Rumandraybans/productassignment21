import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard';
import { CustomerDashboardComponent } from '../customer-dashboard/customer-dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AdminDashboardComponent, CustomerDashboardComponent],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  userRole: string = '';

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Listen to the login status stream. When it flips to true, 
    // immediately check storage for the role and force a view refresh.
    this.authService.getLoginStatus().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        // Grab the explicit role string from storage now that login is verified
        this.userRole = this.authService.getUserRole();
      } else {
        this.userRole = '';
      }

      // Force Angular to re-evaluate the *ngIf structural directives in your HTML template
      this.cdr.detectChanges();
    });
  }
}