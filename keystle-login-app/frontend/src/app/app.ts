import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'Keystle Authentication Demo';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Inicializar o serviço OAuth ao carregar o aplicativo
    this.authService.initOAuth();
  }
}
