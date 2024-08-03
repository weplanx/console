import { TemplateRef } from '@angular/core';

import { Any, AnyDto } from '@weplanx/ng';

export interface Scroll {
  x?: string;
  y: string;
}
export interface Column<T> {
  title: string | TemplateRef<Any>;
  key: keyof AnyDto<T>;
  render?: TemplateRef<{ $implicit: AnyDto<T> }>;
  width?: string;
  display?: boolean;
  ellipsis?: boolean;
  sort?: number;
  format?: ColumnFormat;
}
export type ColumnFormat = 'status' | 'date';
export type Preferences<T> = Pick<Column<T>, 'display' | 'width' | 'sort'>;
export type WpxColumn<T> = Omit<Column<T>, 'display' | 'sort'>;
