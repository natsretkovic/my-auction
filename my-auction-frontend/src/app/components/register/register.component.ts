import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  ime = '';
  prezime = '';
  brojTelefona = '';
  email = '';
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const user = {
      ime: this.ime,
      prezime: this.prezime,
      brojTelefona: this.brojTelefona,
      email: this.email,
      username: this.username,
      password: this.password
    };

    this.auth.register(user).subscribe({
      next: (res) => {
        console.log('Registracija uspešna:', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error.message || 'Greška pri registraciji';
      }
    });
  }
}