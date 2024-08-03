import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import { Option } from './types';

export const OPTION = new InjectionToken<Option>('filebrowser');

export const provideFilebrowser = (option: Option): EnvironmentProviders => {
  return makeEnvironmentProviders([{ provide: OPTION, useValue: option }]);
};
