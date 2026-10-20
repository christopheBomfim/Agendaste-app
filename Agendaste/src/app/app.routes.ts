import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'cadastro-profissional',
    loadComponent: () => import('./pages/cadastro-profissional/cadastro-profissional.page').then( m => m.CadastroProfissionalPage)
  },
  {
    path: 'editar-perfil-profissional',
    loadComponent: () => import('./pages/editar-perfil-profissional/editar-perfil-profissional.page').then( m => m.EditarPerfilProfissionalPage)
  },
  {
    path: 'dashboard-cliente',
    loadComponent: () => import('./pages/dashboard-cliente/dashboard-cliente.page').then( m => m.DashboardClientePage)
  },
  {
    path: 'agendamentos-cliente',
    loadComponent: () => import('./pages/agendamentos-cliente/agendamentos-cliente.page').then( m => m.AgendamentosClientePage)
  },
];
