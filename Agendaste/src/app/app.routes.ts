
import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page')
        .then(m => m.LoginPage)
  },

  // Cadastro Profissional
  {
    path: 'cadastro-profissional',
    loadComponent: () =>
      import(
        './pages/cadastro-profissional/cadastro-profissional.page'
      ).then(m => m.CadastroProfissionalPage)
  },

  // Novo Cliente
  {
    path: 'novo-cliente',
    loadComponent: () =>
      import(
        './pages/novo-cliente/novo-cliente.page'
      ).then(m => m.NovoClientePage)
  },

  // Área Profissional
  {
    path: 'profissional',
    loadComponent: () =>
      import(
        './pages/tabs-profissional/tabs-profissional.page'
      ).then(m => m.TabsProfissionalPage),

    children: [

      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },

      // Dashboard
      {
        path: 'inicio',
        loadComponent: () =>
          import(
            './pages/dashboard-profissional/dashboard-profissional.page'
          ).then(m => m.DashboardProfissionalPage)
      },

      // Clientes
      {
        path: 'clientes',
        loadComponent: () =>
          import(
            './pages/clientes/clientes.page'
          ).then(m => m.ClientesPage)
      },

      // Novo Agendamento
      {
        path: 'agendar',
        loadComponent: () =>
          import(
            './pages/agendar/agendar.page'
          ).then(m => m.AgendarPage)
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import(
            './pages/perfil-profissional/perfil-profissional.page'
          ).then(m => m.PerfilProfissionalPage)
      }


    ]
  },

];
