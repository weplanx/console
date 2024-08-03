import { HttpParams } from '@angular/common/http';
import { AbstractControl, FormGroup } from '@angular/forms';

import { NzTreeNode } from 'ng-zorro-antd/tree';

import { ApiOptions } from '../types';

export const toHttpParams = <T>(options?: ApiOptions<T>): HttpParams => {
  let params = new HttpParams();
  if (options?.keys) {
    options.keys.forEach(v => (params = params.append('keys', v as string)));
  }
  if (options?.sort) {
    Object.entries(options.sort).forEach(([k, v]) => {
      params = params.append('sort', `${k}:${v}`);
    });
  }
  return params;
};

export const updateFormGroup = (controls: AbstractControl[]): void => {
  controls.forEach(control => {
    if (control instanceof FormGroup) {
      updateFormGroup(Object.values(control.controls));
    } else {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    }
  });
};

/**
 * Common Validation Logic
 */
export const validates = {
  password: (value: string) => {
    const len = value.length;
    if (len < 12) {
      return { min: true, error: true };
    }
    if (value.match(/^(?=.*[a-z])[\w|@$!%*?&-+]+$/) === null) {
      return { lowercase: true, error: true };
    }
    if (value.match(/^(?=.*[A-Z])[\w|@$!%*?&-+]+$/) === null) {
      return { uppercase: true, error: true };
    }
    if (value.match(/^(?=.*[0-9])[\w|@$!%*?&-+]+$/) === null) {
      return { number: true, error: true };
    }
    if (value.match(/^(?=.*[@$!%*?&-+])[\w|@$!%*?&-+]+$/) === null) {
      return { symbol: true, error: true };
    }
    return null;
  }
};

/**
 * Tree view expanded state
 */
export const expandTreeNodes = (nodes: NzTreeNode[], value: boolean): void => {
  for (const node of nodes) {
    node.isExpanded = value;
    if (node.children.length !== 0) {
      expandTreeNodes(node.children, value);
    }
  }
};
