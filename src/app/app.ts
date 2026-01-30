import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';

/**
 * Componente raíz de la aplicación
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private titleService = inject(Title);
  title = `${environment.projectName} ${environment.version}`;

  constructor() {
    this.titleService.setTitle(this.title);
  }
}
