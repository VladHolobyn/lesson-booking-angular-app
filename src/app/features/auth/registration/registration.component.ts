import {Component, inject} from '@angular/core';
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

  private authService = inject(AuthService);
  private router = inject(Router);



  form: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.min(6)]),
    email: new FormControl('', [Validators.required, Validators.email])
  })

  showPassword: boolean = false;



  onSubmit() {
    if (this.form.valid) {
      this.authService.register(this.form.value).subscribe({
        next: ()=> this.router.navigate(['/auth/login']),
        error: () => console.log("Error")
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
