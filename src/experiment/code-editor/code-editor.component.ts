import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';

@Component({
  standalone: true,
  imports: [ShareModule, NzCodeEditorModule],
  selector: 'x-code-editor',
  templateUrl: './code-editor.component.html'
})
export class CodeEditorComponent {
  form: FormGroup = this.fb.group({
    content: []
  });

  constructor(private fb: FormBuilder) {}

  submit(value: Any): void {
    console.log(value);
  }
}
