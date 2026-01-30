import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as HomeActions from './store/home.actions';
import * as HomeSelectors from './store/home.selectors';

/**
 * Componente principal del feature Home
 * Ejemplo de componente conectado a NgRx
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  data$: Observable<any>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(private store: Store) {
    // Suscribirse a los selectores
    this.data$ = this.store.select(HomeSelectors.selectHomeData);
    this.loading$ = this.store.select(HomeSelectors.selectHomeLoading);
    this.error$ = this.store.select(HomeSelectors.selectHomeError);
  }

  ngOnInit(): void {
    // Disparar acción para cargar datos
    this.store.dispatch(HomeActions.loadHomeData());
  }

  reload(): void {
    this.store.dispatch(HomeActions.loadHomeData());
  }
}
