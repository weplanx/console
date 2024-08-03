import { Routes } from '@angular/router';

export const filebrowserRoutes: Routes = [
  {
    path: 'filebrowser',
    loadComponent: () => import('./filebrowser.component').then(m => m.FilebrowserComponent),
    data: {
      breadcrumb: `File Browser`
    },
    children: [
      {
        path: 'pictures',
        loadComponent: () => import('./pictures/pictures.component').then(m => m.PicturesComponent),
        data: {
          breadcrumb: `Picture`
        }
      },
      {
        path: 'videos',
        loadComponent: () => import('./videos/videos.component').then(m => m.VideosComponent),
        data: {
          breadcrumb: `Video`
        }
      },
      { path: '', redirectTo: 'pictures', pathMatch: 'full' }
    ]
  }
];
