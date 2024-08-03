import { Routes } from '@angular/router';

export const experimentRoutes: Routes = [
  {
    path: 'experiment',
    loadComponent: () => import('./experiment.component').then(m => m.ExperimentComponent),
    children: [
      {
        path: 'store',
        loadComponent: () => import('./store/store.component').then(m => m.StoreComponent),
        data: {
          breadcrumb: `Indexed DB`
        }
      },
      {
        path: 'table',
        loadComponent: () => import('./table/table.component').then(m => m.TableComponent),
        data: {
          breadcrumb: `Table`
        }
      },
      {
        path: 'upload',
        loadComponent: () => import('./upload/upload.component').then(m => m.UploadComponent),
        data: {
          breadcrumb: `Upload`
        }
      },
      {
        path: 'article',
        loadComponent: () => import('./article/article.component').then(m => m.ArticleComponent),
        data: {
          breadcrumb: `Article`
        }
      },
      {
        path: 'code-editor',
        loadComponent: () => import('./code-editor/code-editor.component').then(m => m.CodeEditorComponent),
        data: {
          breadcrumb: `Code Editor`
        }
      },
      { path: '', redirectTo: 'store', pathMatch: 'full' }
    ]
  }
];
