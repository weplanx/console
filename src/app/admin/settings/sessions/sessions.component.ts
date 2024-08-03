import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AppService } from '@app';
import { User } from '@common/models/user';
import { UsersService } from '@common/services/users.service';
import { ShareModule } from '@common/share.module';
import { AnyDto, WpxItems } from '@weplanx/ng';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { SessionsService } from './sessions.service';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-settings-sessions',
  templateUrl: './sessions.component.html',
  providers: [SessionsService]
})
export class SessionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(NzCardComponent, { read: ElementRef, static: true }) card!: ElementRef;

  items = new WpxItems<AnyDto<User>>('_id');
  interval = 15;

  y = '0px';
  private refresh!: Subscription;
  private resizeObserver!: ResizeObserver;

  constructor(
    public app: AppService,
    private sessions: SessionsService,
    private users: UsersService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect;
        this.y = height - 180 + 'px';
      }
    });
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.card.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    this.refresh.unsubscribe();
  }

  getData(due = 0): void {
    if (this.refresh) {
      this.refresh.unsubscribe();
    }
    this.refresh = timer(due, this.interval * 1000)
      .pipe(
        switchMap(() => this.sessions.get()),
        switchMap(v =>
          this.users.find(
            {
              _id: { $in: v }
            },
            {
              xfilter: { '_id->$in': 'oids' }
            }
          )
        )
      )
      .subscribe(({ data }) => {
        this.items.data = [
          ...data.filter(v => {
            if (this.items.searchText !== '') {
              return !!v.email.match(`^${this.items.searchText}`);
            }
            return v;
          })
        ];
        console.debug(`session: refreshed`);
      });
  }

  clearSearch(): void {
    this.items.searchText = '';
    this.getData();
  }

  delete(doc: AnyDto<User>): void {
    this.modal.confirm({
      nzTitle: `Do you want to interrupt this session?`,
      nzContent: doc.email,
      nzOkDanger: true,
      nzOnOk: () => {
        this.sessions.delete(doc._id).subscribe(() => {
          this.message.success(`Session interrupted`);
        });
      }
    });
  }

  bulkDelete(): void {
    this.modal.confirm({
      nzTitle: `Do you want to interrupt these sessions?`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.sessions.clear().subscribe(() => {
          this.message.success(`Session interrupted`);
        });
      }
    });
  }
}
