import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Builder, Field, FieldTypeDict } from '@common/models/builder';
import { BuildersService } from '@common/services/builders.service';
import { ShareModule } from '@common/share.module';
import { AnyDto } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { FieldComponent, FieldInput } from '../field/field.component';

@Component({
  standalone: true,
  imports: [ShareModule, DragDropModule],
  selector: 'app-index-builders-schema',
  templateUrl: './schema.component.html',
  styleUrl: './schema.component.css'
})
export class SchemaComponent implements OnInit, OnDestroy {
  data?: AnyDto<Builder>;
  fields: Field[] = [];
  fieldTypeDict = FieldTypeDict;

  private id!: string;
  private updated!: Subscription;

  constructor(
    private builders: BuildersService,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.getData();
    });
    this.updated = this.builders.updated.subscribe(id => {
      if (this.id === id) {
        this.getData();
      }
    });
  }

  ngOnDestroy(): void {
    this.updated.unsubscribe();
  }

  getData(): void {
    this.builders.findById(this.id).subscribe(data => {
      this.data = data;
      this.fields = data.schema?.fields ?? [];
    });
  }

  sort(e: CdkDragDrop<string[]>): void {
    moveItemInArray(this.fields, e.previousIndex, e.currentIndex);
    this.fields = [...this.fields];
    this.builders
      .sortSchemaFields(
        this.id,
        this.fields.map(v => v.key)
      )
      .subscribe(() => {
        this.message.success('Field sorted successful');
      });
  }

  openField(field?: Field): void {
    this.modal.create<FieldComponent, FieldInput>({
      nzTitle: !field ? 'Create Field' : `Modify Field(${field.name})`,
      nzWidth: 1200,
      nzContent: FieldComponent,
      nzData: {
        doc: this.data!,
        field
      },
      nzOnOk: () => {
        this.getData();
      }
    });
  }

  delete(field: Field): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete this?`,
      nzContent: field.name,
      nzOkText: `Yes`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.builders.deleteSchemaField(this.id, field.key).subscribe(() => {
          this.getData();
          this.message.success('Deletion successful');
        });
      },
      nzCancelText: `Think again`
    });
  }
}
