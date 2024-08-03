import { Any } from '@weplanx/ng';

export interface Builder {
  parent: string | null;
  name: string;
  kind: string;
  icon?: string;
  description?: string;
  schema?: BuilderSchema;
  status: boolean;
  sort: number;
}

export interface BuilderSchema {
  key: string;
  fields: Field[];
  rules?: Rule[];
}

export interface Field {
  name: string;
  key: string;
  type: keyof typeof FieldTypeDict;
  required: boolean;
  visible: boolean;
  default_to: Any;
  placeholder?: string;
  description?: string;
  option?: Partial<FieldOption>;
}

export interface FieldOption {
  max: number;
  min: number;
  decimal: number;
  time: boolean;
  enums: Enum[];
  ref: string;
  ref_key: string;
  component: string;
  multiple: boolean;
}

export interface Enum {
  label: string;
  value: Any;
}

export interface Rule {
  logic: string;
  conditions: RuleCondition[];
  keys: string[];
}

export interface RuleCondition {
  key: string;
  op: string;
  value: Any;
}

export const FieldTypeDict = {
  string: 'Input',
  text: 'Text',
  number: 'Number',
  date: 'Date',
  password: 'Password',
  richtext: 'RichText',
  bool: 'Switch',
  dates: 'Dates',
  radio: 'Radio',
  checkbox: 'Checkbox',
  select: 'Select',
  ref: 'Ref',
  picture: 'Picture',
  video: 'Video',
  file: 'File',
  manual: 'Manual'
};
