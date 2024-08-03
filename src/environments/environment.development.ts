import { Routes } from '@angular/router';

import { experimentRoutes } from '../experiment/experiment.routes';

export const environment = {
  production: false,
  baseUrl: 'https://api-x.kainonly.com:8443',
  cdn: 'https://cdn.kainonly.com',
  extend: <Routes>[...experimentRoutes]
};
