import { Component, OnInit } from '@angular/core';

import { ShareModule } from '@common/share.module';
import { WpxStoreService } from '@weplanx/ng';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';

interface MyDoc {
  title: string;
}

@Component({
  standalone: true,
  imports: [ShareModule, NzCodeEditorModule],
  selector: 'x-store',
  templateUrl: './store.component.html'
})
export class StoreComponent implements OnInit {
  data = '';
  title = '';

  constructor(private store: WpxStoreService) {}

  ngOnInit(): void {
    this.get();
  }

  get(): void {
    this.store.get<MyDoc>('mydocs').subscribe(doc => {
      this.data = JSON.stringify(doc);
      console.log(doc);
    });
  }

  set(): void {
    this.store.set<MyDoc>('mydocs', { title: 'hi' }).subscribe(result => {
      console.log(result);
      this.get();
    });
  }

  update(): void {
    this.store.set<MyDoc>('mydocs', { title: this.title }).subscribe(result => {
      console.log(result);
      this.get();
    });
  }

  delete(): void {
    this.store.remove('mydocs').subscribe(() => {
      console.log('ok');
      this.get();
    });
  }
}
