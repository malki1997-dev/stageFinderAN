// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router, RouterLink, ActivatedRoute } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';
// import { PasswordModule } from 'primeng/password';
// import { CardModule } from 'primeng/card';
// import { MessageModule } from 'primeng/message';
// import { MessagesModule } from 'primeng/messages';
// import { AuthService } from '../auth.service';
// import { UserDTO } from '../../user/user.model';

// @Component({
//   selector: 'app-login',
//   imports: [
//     CommonModule,
//     ButtonModule,
//     InputTextModule,
//     PasswordModule,
//     CardModule,
//     MessageModule,
//     MessagesModule,
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent implements OnInit {
//   loginForm: FormGroup;
//   errorMessage: string | null = null;
//   returnUrl: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private authService: AuthService,
//     private route: ActivatedRoute
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required]
//     });
//   }

//   ngOnInit(): void {
//     // Récupérer le returnUrl depuis les queryParams
//     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
//   }

//   onSubmit(): void {
//     if (this.loginForm.valid) {
//       const { email, password } = this.loginForm.value;
//       console.log('AAAAAAA');
//       this.authService.login(email, password).subscribe({
//         next: (user: UserDTO) => {
//           console.log('BBBBBB');
//           const userData = {
//             id: user.id,
//             role: user.role,
//             nom: user.nom
//           };
//           localStorage.setItem('user', JSON.stringify(userData));
//           console.log(userData);
//           this.router.navigate(['']);
//         },
//         error: (err) => {
//           this.errorMessage = err.error.message || 'Email ou mot de passe incorrect.';
//         }
//       });
//     }
//   }

//   regchoix() {
//     this.router.navigate(['regchoix']);
//   }
// }
