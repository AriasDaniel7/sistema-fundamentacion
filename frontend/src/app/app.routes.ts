import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [isNotAuthenticatedGuard],
    loadComponent: () =>
      import('./auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'panel',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('./dashboard/pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
    children: [
      {
        path: 'projects',
        loadComponent: () =>
          import(
            './dashboard/pages/projects-page/projects-page.component'
          ).then((m) => m.ProjectsPageComponent),
      },
      {
        path: 'project',
        loadComponent: () =>
          import('./dashboard/pages/project-page/project-page.component').then(
            (m) => m.ProjectPageComponent
          ),
      },
      {
        path: 'project/:id',
        loadComponent: () =>
          import(
            './dashboard/pages/project-information-page/project-information-page.component'
          ).then((m) => m.ProjectInformationPageComponent),
      },
      {
        path: '**',
        redirectTo: 'projects',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
