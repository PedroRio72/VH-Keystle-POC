import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'callback', component: AppComponent },
  { path: 'login', component: AppComponent },
  { path: '', component: AppComponent }
];
