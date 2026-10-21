import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Auth / Início
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'login-cliente',
    loadComponent: () =>
      import('./pages/login-cliente/login-cliente.page').then(m => m.LoginClientePage)
  },
  {
    path: 'novo-cliente',
    loadComponent: () =>
      import('./pages/novo-cliente/novo-cliente.page').then(m => m.NovoClientePage)
  },
  {
    path: 'cadastro-profissional',
    loadComponent: () =>
      import('./pages/cadastro-profissional/cadastro-profissional.page').then(
        m => m.CadastroProfissionalPage
      )
  },

  // Área Profissional
  {
    path: 'profissional',
    loadComponent: () =>
      import('./pages/tabs-profissional/tabs-profissional.page').then(
        m => m.TabsProfissionalPage
      ),
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/dashboard-profissional/dashboard-profissional.page').then(
            m => m.DashboardProfissionalPage
          )
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./pages/clientes/clientes.page').then(m => m.ClientesPage)
      },
      {
        path: 'agendar',
        loadComponent: () =>
          import('./pages/agendar/agendar.page').then(m => m.AgendarPage)
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./pages/perfil-profissional/perfil-profissional.page').then(
            m => m.PerfilProfissionalPage
          )
      }
    ]
  },
  {
    path: 'editar-perfil-profissional',
    loadComponent: () =>
      import(
        './pages/editar-perfil-profissional/editar-perfil-profissional.page'
      ).then(m => m.EditarPerfilProfissionalPage)
  },

  // Área do Cliente
  {
    path: 'dashboard-cliente',
    loadComponent: () =>
      import('./pages/dashboard-cliente/dashboard-cliente.page').then(
        m => m.DashboardClientePage
      )
  },
  {
    path: 'agendamentos-cliente',
    loadComponent: () =>
      import('./pages/agendamentos-cliente/agendamentos-cliente.page').then(
        m => m.AgendamentosClientePage
      )
  },
  {
    path: 'detalhes-agendamento',
    loadComponent: () =>
      import('./pages/detalhes-agendamento/detalhes-agendamento.page').then(
        m => m.DetalhesAgendamentoPage
      )
  },
  {
    path: 'perfil-cliente',
    loadComponent: () =>
      import('./pages/perfil-cliente/perfil-cliente.page').then(
        m => m.PerfilClientePage
      )
  }
];