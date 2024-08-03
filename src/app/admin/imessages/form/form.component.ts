import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';

import { Imessage } from '@common/models/imessage';
import { Project } from '@common/models/project';
import { ImessagesService } from '@common/services/imessages.service';
import { ProjectsService } from '@common/services/projects.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface FormInput {
  doc?: AnyDto<Imessage>;
}

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-imessages-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    topic: ['', [Validators.required]],
    description: [''],
    projects: [[], [Validators.required]]
  });
  tips = {
    topic: {
      default: {
        required: `Topic cannot be empty`
      }
    },
    projects: {
      default: {
        required: `Authorized projects cannot be empty`
      }
    }
  };

  projects$ = new BehaviorSubject<string>('');
  projectItems: AnyDto<Project>[] = [];

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: FormInput,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private imessages: ImessagesService,
    private projects: ProjectsService
  ) {}

  ngOnInit(): void {
    if (this.data.doc) {
      this.form.patchValue(this.data.doc);
    }
    this.projects$
      .asObservable()
      .pipe(debounceTime(500))
      .subscribe(v => {
        this.getProjects(v);
      });
  }

  getProjects(v: string): void {
    this.projects.find({ name: { $regex: '^' + v } }).subscribe(({ data }) => {
      this.projectItems = [...data];
    });
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    if (!this.data.doc) {
      this.imessages.create(data, { xdata: { projects: 'oids' } }).subscribe(() => {
        this.message.success(`Update successful`);
        this.modalRef.triggerOk();
      });
    } else {
      this.imessages
        .updateById(
          this.data.doc._id,
          { $set: data },
          {
            xdata: { '$set->projects': 'oids' }
          }
        )
        .subscribe(() => {
          this.message.success(`Update successful`);
          this.modalRef.triggerOk();
        });
    }
  }
}
