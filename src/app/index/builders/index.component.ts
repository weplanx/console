import { Component } from '@angular/core';

import { ShareModule } from '@common/share.module';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  standalone: true,
  imports: [ShareModule, NzResultModule],
  selector: 'app-index-builders-index',
  template: `
    <nz-result nzStatus="info">
      <div nz-result-title> Introduction </div>
      <div nz-result-content>
        <p>
          🔥 In the outline, [click] any element to view the content model, [right click] to get more operations, and
          [drag and drop] to reorganize.
        </p>
        <p>The following are the main types of content generators:</p>
        <div style="padding: 0 1.5em">
          <nz-space nzDirection="vertical">
            <div *nzSpaceItem> <nz-tag nzColor="blue">Nav</nz-tag> Usually used for navigation group display</div>
            <div *nzSpaceItem>
              <nz-tag nzColor="blue">Collection</nz-tag> Usually used for a collection of entities, such as a list page
            </div>
            <div *nzSpaceItem>
              <nz-tag nzColor="blue">Single</nz-tag> Usually used for independent entities, such as single pages.
            </div>
            <div *nzSpaceItem>
              <nz-tag nzColor="blue">Manual</nz-tag> Programmatically customize pages with identity
            </div>
            <div *nzSpaceItem><nz-tag nzColor="error">Off</nz-tag> This element is not published to the project</div>
          </nz-space>
        </div>
      </div>
    </nz-result>
  `
})
export class IndexComponent {}
