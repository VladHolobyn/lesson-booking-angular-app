import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatError, MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
    imports: [
        FormsModule,
        MatAnchor,
        MatButton,
        MatError,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatSuffix,
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);


  form: FormGroup = new FormGroup({
    email: new FormControl('test@gmail.com', [Validators.required, Validators.email]),
    password: new FormControl('Qwerty123!', [Validators.required, Validators.min(6)])
  });

  showPassword: boolean = false;



  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe({
        next: ()=> this.router.navigate(['/']),
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
