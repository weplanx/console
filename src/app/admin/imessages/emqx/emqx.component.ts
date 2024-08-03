import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap, timer } from 'rxjs';

import { EmqxNode } from '@common/models/imessage';
import { ImessagesService } from '@common/services/imessages.service';
import { ShareModule } from '@common/share.module';
import { NzModalService } from 'ng-zorro-antd/modal';

import { FormComponent } from './form/form.component';

@Component({
  standalone: true,
  imports: [ShareModule, FormComponent],
  selector: 'app-admin-imessages-emqx',
  templateUrl: './emqx.component.html'
})
export class EmqxComponent implements OnInit, OnDestroy {
  nodes: EmqxNode[] = [];

  private refresh!: Subscription;

  constructor(
    private modal: NzModalService,
    private imessages: ImessagesService
  ) {}

  ngOnInit(): void {
    this.refresh = timer(0, 5000)
      .pipe(switchMap(() => this.imessages.getNodes()))
      .subscribe(data => {
        this.nodes = [...data];
      });
  }

  ngOnDestroy(): void {
    this.refresh.unsubscribe();
  }

  openForm(): void {
    this.modal.create<FormComponent>({
      nzTitle: `EMQX`,
      nzContent: FormComponent
    });
  }
}
