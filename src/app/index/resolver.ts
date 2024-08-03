import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { AppService } from '@app';
import { Project } from '@common/models/project';
import { AnyDto } from '@weplanx/ng';

export const resolver: ResolveFn<AnyDto<Project>> = (route: ActivatedRouteSnapshot) => {
  const app = inject(AppService);
  app.context = route.params['namespace'];
  return app.fetchContextData();
};
