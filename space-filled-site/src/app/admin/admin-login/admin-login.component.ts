import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent {
  password = '';
  error = '';
  loading = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/admin']);
    }
  }

  login(): void {
    this.loading = true;
    this.error = '';
    this.api.login(this.password).subscribe({
      next: (res) => {
        this.auth.setToken(res.token);
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.error = 'Invalid password';
        this.loading = false;
      },
    });
  }
}
