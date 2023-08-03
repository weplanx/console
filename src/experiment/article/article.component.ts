import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Any } from '@weplanx/ng';
import { RichtextData } from '@weplanx/ng/richtext';

@Component({
  selector: 'app-exp-article',
  templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      content: []
    });
    setTimeout(() => {
      this.form.patchValue({
        content: <RichtextData>{
          blocks: [
            {
              data: { text: 'asdasddada' },
              id: 'AhGrg_O60T',
              type: 'paragraph'
            }
          ],
          time: 1669196916656,
          version: '2.24.3'
        }
      });
    }, 1000);
    setTimeout(() => {
      this.form.patchValue({
        content: <RichtextData>{
          blocks: [
            {
              data: { text: 'ssssswwwe' },
              id: 'AhGrg_O60T',
              type: 'paragraph'
            }
          ],
          time: 1669196916656,
          version: '2.24.3'
        }
      });
    }, 3000);
  }

  submit(value: Any): void {
    console.log(value);
  }

  test(value: Any): void {
    console.log(value);
  }
}
