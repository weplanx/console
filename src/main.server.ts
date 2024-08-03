import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
