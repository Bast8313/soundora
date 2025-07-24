import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private http: HttpClient) {}

  login() {
    this.http.post<{ token: string }>('http://localhost:3010/api/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.error = '';
        alert('Connexion réussie !');
        // redirige l'utilisateur si besoin
      },
      error: () => {
        this.error = 'Nom d\'utilisateur ou mot de passe incorrect';
      }
    });
  }
}
