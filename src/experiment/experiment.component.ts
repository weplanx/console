import { Component } from '@angular/core';

import { NavComponent } from '@common/components/nav/nav.component';
import { ShareModule } from '@common/share.module';

@Component({
  standalone: true,
  imports: [ShareModule, NavComponent],
  selector: 'x-experiment',
  templateUrl: './experiment.component.html'
})
export class ExperimentComponent {}
