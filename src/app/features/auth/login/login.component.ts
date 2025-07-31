import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { AuthService } from '../auth.service';
import { UserDTO } from '../../user/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
    MessagesModule,
    ReactiveFormsModule,
    RouterLink
    // Removed PopoverModule as it's not used in the template
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  returnUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Attempting login with:', { email });
      this.authService.login(email, password).subscribe({
        next: (user: UserDTO) => {
          console.log('Login successful, user:', user);
          this.errorMessage = null;
          this.router.navigate([""]);
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = err.message || 'Email ou mot de passe incorrect.';
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }

  regchoix(): void {
    this.router.navigate(['regchoix']);
  }
}
