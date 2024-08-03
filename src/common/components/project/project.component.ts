import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { AppService } from '@app';
import { Project } from '@common/models/project';
import { ProjectsService } from '@common/services/projects.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface ProjectInput {
  doc?: AnyDto<Project>;
}

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {
  checkNamespace = (control: AbstractControl): Observable<Any> => {
    if (control.value === this.data.doc?.namespace) {
      return of(null);
    }
    return this.projects.existsNamespace(control.value);
  };
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    namespace: ['', [Validators.required, Validators.pattern(/[a-z_]+/)], [this.checkNamespace]],
    kind: ['', [Validators.required]],
    expire: [null],
    secret_id: [''],
    secret_key: [''],
    status: [true, [Validators.required]]
  });
  tips = {
    name: {
      default: {
        required: `Project name cannot be empty`
      }
    },
    namespace: {
      default: {
        required: `Namespace cannot be empty`,
        pattern: `Namespace must be lowercase letter, allow underlining`,
        duplicated: `Namespaces must be unique`
      }
    }
  };

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: ProjectInput,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private projects: ProjectsService,
    private app: AppService
  ) {}

  ngOnInit(): void {
    if (this.data.doc) {
      this.form.patchValue(this.data.doc);
      this.form.get('namespace')!.disable();
      this.form.get('kind')!.disable();
    }
  }

  generateSecret(): void {
    this.app.generateSecret().subscribe(data => {
      this.form.patchValue({
        secret_id: data.id,
        secret_key: data.key
      });
    });
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    if (!this.data.doc) {
      this.projects
        .create(data, {
          xdata: {
            expire: 'timestamp'
          }
        })
        .subscribe(() => {
          this.message.success(`Update successful`);
          this.modalRef.triggerOk();
        });
    } else {
      this.projects
        .updateById(
          this.data.doc._id,
          { $set: data },
          {
            xdata: {
              '$set->expire': 'timestamp'
            }
          }
        )
        .subscribe(() => {
          this.message.success(`Update successful`);
          this.modalRef.triggerOk();
        });
    }
  }
}
