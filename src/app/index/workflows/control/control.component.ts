import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';

import { Endpoint } from '@common/models/endpoint';
import { Workflow } from '@common/models/workflow';
import { EndpointsService } from '@common/services/endpoints.service';
import { WorkflowsService } from '@common/services/workflows.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto } from '@weplanx/ng';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCronExpressionModule } from 'ng-zorro-antd/cron-expression';
import { NzMessageService } from 'ng-zorro-antd/message';

import { LogsComponent } from './logs/logs.component';
import { StateComponent } from './state/state.component';

@Component({
  standalone: true,
  imports: [ShareModule, NzCollapseModule, NzCronExpressionModule, DragDropModule, LogsComponent, StateComponent],
  selector: 'app-index-workflows-control',
  templateUrl: './control.component.html'
})
export class ControlComponent implements OnInit {
  @Input({ required: true }) tabIndex!: number;
  @Input({ required: true }) doc!: AnyDto<Workflow>;
  @Input({ required: true }) updated!: () => void;

  form!: FormGroup;
  tips = {
    ref: {
      default: {
        required: `Service Node cannot be empty`
      }
    }
  };
  scheduleText$ = new BehaviorSubject<string>('');
  scheduleItems: AnyDto<Endpoint>[] = [];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private endpoints: EndpointsService,
    private workflows: WorkflowsService
  ) {}

  ngOnInit(): void {
    switch (this.doc.kind) {
      case 'schedule':
        this.form = this.fb.group({
          ref: ['', [Validators.required]],
          status: [true, [Validators.required]],
          jobs: this.fb.array([])
        });
        if (this.doc.schedule) {
          this.doc.schedule.jobs.forEach(v => this.appendJob(v));
          this.form.patchValue(this.doc.schedule);
        }
        this.scheduleText$
          .asObservable()
          .pipe(debounceTime(500))
          .subscribe(v => {
            this.getSchedules(v);
          });
        break;
    }
  }

  sync(): void {
    this.workflows.sync(this.doc._id).subscribe(() => {
      this.message.success(`Trigger events synchronized`);
    });
  }

  getSchedules(value: string): void {
    this.endpoints.find({ kind: 'schedule', name: { $regex: value } }).subscribe(({ data }) => {
      this.scheduleItems = [...data];
    });
  }

  get jobs(): FormArray {
    return this.form.get('jobs') as FormArray;
  }

  appendJob(value?: Any): void {
    const f = this.fb.group({
      mode: ['HTTP', [Validators.required]],
      spec: ['0 */5 * * * *', [Validators.required]],
      option: this.fb.group({
        method: ['POST', [Validators.required]],
        url: ['', [Validators.required]],
        headers: [],
        body: []
      })
    });
    this.jobs.push(f);
    if (value) {
      f.patchValue(value);
    }
  }

  removeJob(index: number): void {
    this.jobs.removeAt(index);
  }

  sort(event: CdkDragDrop<string[]>, data: FormArray): void {
    moveItemInArray(data.controls, event.previousIndex, event.currentIndex);
    data.controls.forEach((value, index) => data.setControl(index, value));
  }

  submit(data: Any): void {
    this.workflows
      .updateById(
        this.doc._id,
        {
          $set: { schedule: data }
        },
        {
          xdata: {
            '$set->schedule->ref': 'oid'
          }
        }
      )
      .pipe(switchMap(() => this.workflows.findById(this.doc._id)))
      .subscribe(data => {
        this.doc = data;
        this.updated();
        this.sync();
      });
  }
}
