import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule, NzCodeEditorModule],
  selector: 'app-codeview',
  template: `
    <nz-code-editor style="height: 500px; width: 100%" [ngModel]="content" [nzEditorOption]="option"></nz-code-editor>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeviewComponent implements OnInit {
  content = '';
  option: Any = {
    readOnly: true
  };

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: Any,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {
    switch (typeof this.data) {
      case 'object':
        this.option.language = 'json';
        this.content = JSON.stringify(this.data, null, 2);
        break;
      case 'string':
        try {
          const data = JSON.parse(this.data);
          this.option.language = 'json';
          this.content = JSON.stringify(data, null, 2);
        } catch (e) {
          this.content = this.data;
        }
        break;
    }
  }

  close(): void {
    this.modalRef.triggerCancel();
  }
}
