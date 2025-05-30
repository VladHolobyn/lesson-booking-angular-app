import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-registration',
  imports: [
    MatFormFieldModule,
    MatLabel,
    MatIcon,
    MatInput,
    MatButton,
    MatIconButton,
    RouterLink,
    MatAnchor,
    ReactiveFormsModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

  showPassword: boolean = false;

  form: FormGroup = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.min(6)]),
    email: new FormControl('', [Validators.required, Validators.email])
  })

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.authService.register(this.form.value).subscribe({
        next: ()=> {
          this.router.navigate(['/auth/login'])
        },
        error: () => {
          console.log("Error")
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  togglePassword(event: Event) {
    event.stopPropagation();
    event.preventDefault()
    this.showPassword = !this.showPassword;
  }
}
