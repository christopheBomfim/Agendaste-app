
import { Routes } from '@angular/router';

// AuthGuard do profissional
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // ==========================================
  // ROTA INICIAL
  // ==========================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // ==========================================
  // AUTENTICAÇÃO E CADASTRO
  // ==========================================

  // Login Profissional
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page')
        .then(m => m.LoginPage)
  },

  // Login / Acesso do Cliente
  {
    path: 'login-cliente',
    loadComponent: () =>
      import('./pages/login-cliente/login-cliente.page')
        .then(m => m.LoginClientePage)
  },

  // Cadastro de Novo Cliente
  {
    path: 'novo-cliente',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/novo-cliente/novo-cliente.page')
        .then(m => m.NovoClientePage)
  },

  // Cadastro Profissional
  {
    path: 'cadastro-profissional',
    loadComponent: () =>
      import(
        './pages/cadastro-profissional/cadastro-profissional.page'
      ).then(m => m.CadastroProfissionalPage)
  },

  // ==========================================
  // ÁREA DO PROFISSIONAL
  // ==========================================

  {
    path: 'profissional',

    // Protege a entrada na área profissional
    canActivate: [authGuard],

    // Verifica também a navegação entre as abas
    canActivateChild: [authGuard],

    loadComponent: () =>
      import(
        './pages/tabs-profissional/tabs-profissional.page'
      ).then(m => m.TabsProfissionalPage),

    children: [

      // Rota inicial do profissional
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },

      // Dashboard Profissional
      {
        path: 'inicio',
        loadComponent: () =>
          import(
            './pages/dashboard-profissional/dashboard-profissional.page'
          ).then(m => m.DashboardProfissionalPage)
      },

      // Lista de Clientes
      {
        path: 'clientes',
        loadComponent: () =>
          import('./pages/clientes/clientes.page')
            .then(m => m.ClientesPage)
      },

      // Novo Agendamento
      {
        path: 'agendar',
        loadComponent: () =>
          import('./pages/agendar/agendar.page')
            .then(m => m.AgendarPage)
      },

      // Perfil Profissional
      {
        path: 'perfil',
        loadComponent: () =>
          import(
            './pages/perfil-profissional/perfil-profissional.page'
          ).then(m => m.PerfilProfissionalPage)
      }

    ]
  },

  // ==========================================
  // EDITAR PERFIL PROFISSIONAL
  // ==========================================

  {
    path: 'editar-perfil-profissional',

    canActivate: [authGuard],

    loadComponent: () =>
      import(
        './pages/editar-perfil-profissional/editar-perfil-profissional.page'
      ).then(m => m.EditarPerfilProfissionalPage)
  },

  // ==========================================
  // ÁREA DO CLIENTE
  // ==========================================

  // Dashboard Cliente
  {
    path: 'dashboard-cliente',
    loadComponent: () =>
      import(
        './pages/dashboard-cliente/dashboard-cliente.page'
      ).then(m => m.DashboardClientePage)
  },

  // Agendamentos do Cliente
  {
    path: 'agendamentos-cliente',
    loadComponent: () =>
      import(
        './pages/agendamentos-cliente/agendamentos-cliente.page'
      ).then(m => m.AgendamentosClientePage)
  },

  // Detalhes do Agendamento
  {
    path: 'detalhes-agendamento',
    loadComponent: () =>
      import(
        './pages/detalhes-agendamento/detalhes-agendamento.page'
      ).then(m => m.DetalhesAgendamentoPage)
  },

  // Perfil Cliente
  {
    path: 'perfil-cliente',
    loadComponent: () =>
      import(
        './pages/perfil-cliente/perfil-cliente.page'
      ).then(m => m.PerfilClientePage)
  }

];
