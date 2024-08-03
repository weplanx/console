export type Any = any; // eslint-disable-line
export type AnyDto<T> = T & BasicDto;
export interface R {
  [key: string]: Any;
}
export interface BasicDto extends R {
  _id: string;
  create_time: Date;
  update_time: Date;
}
export type FieldOperators<DataType> = Partial<{
  $eq: DataType;
  $gt: DataType;
  $gte: DataType;
  $in: DataType[];
  $lt: DataType;
  $lte: DataType;
  $ne: DataType;
  $nin: DataType[];
  $regex: string;
  $exists: boolean;
}>;
export type Operators = Partial<{
  $and: Any[];
  $not: Any;
  $nor: Any;
  $or: Any[];
  $text: Partial<{
    $search: string;
    $language: string;
    $caseSensitive: boolean;
    $diacriticSensitive: boolean;
  }>;
}>;
export type Filter<T> = Partial<{ [P in keyof AnyDto<T>]: AnyDto<T>[P] | FieldOperators<AnyDto<T>[P]> }> &
  Operators &
  R;
export interface UpdateOperators<T> {
  $inc: Partial<{ [P in keyof AnyDto<T>]: number }> & { [key: string]: number };
  $rename: Partial<{ [P in keyof AnyDto<T>]: string }> & { [key: string]: string };
  $set: Partial<{ [P in keyof AnyDto<T>]: AnyDto<T>[P] }> & R;
  $unset: Partial<{ [P in keyof AnyDto<T>]: '' }> & { [key: string]: '' };
  $push: Partial<{ [P in keyof AnyDto<T>]: AnyDto<T>[P] }> & R;
  $pull: Partial<{ [P in keyof AnyDto<T>]: AnyDto<T>[P] }> & R;
}
export type Update<T> = Partial<UpdateOperators<T>>;
export type Sort<T> = Partial<{ [P in keyof AnyDto<T>]: -1 | 1 }>;
export interface XFilter {
  [key: string]: XFilterKind;
}
export type XFilterKind = 'oid' | 'oids' | 'date' | 'dates' | 'timestamp' | 'timestamps';
export interface XData {
  [key: string]: XDataKind;
}
export type XDataKind = 'oid' | 'oids' | 'date' | 'dates' | 'timestamp' | 'timestamps' | 'password' | 'cipher';
export interface ApiOptions<T> {
  keys?: Array<keyof AnyDto<T>>;
  sort?: Sort<T>;
  page?: number;
  pagesize?: number;
  xfilter?: XFilter;
  xdata?: XData;
  arrayFilters?: R[];
  txn?: string;
}
export type FilterOption<T> = Pick<ApiOptions<T>, 'xfilter'>;
export type CreateOption<T> = Pick<ApiOptions<T>, 'xdata' | 'txn'>;
export type FindOption<T> = Omit<ApiOptions<T>, 'xdata' | 'txn'>;
export interface FindResult<T> {
  data: Array<AnyDto<T>>;
  total: number;
}
export type FindOneOption<T> = Pick<ApiOptions<T>, 'keys' | 'xfilter'>;
export type FindByIdOption<T> = Pick<ApiOptions<T>, 'keys'>;
export type UpdateOption<T> = Pick<ApiOptions<T>, 'xfilter' | 'xdata' | 'arrayFilters' | 'txn'>;
export type UpdateOneByIdOption<T> = Pick<ApiOptions<T>, 'xdata' | 'arrayFilters' | 'txn'>;
export type ReplaceOption<T> = Pick<ApiOptions<T>, 'xdata' | 'txn'>;
export type DeleteOption<T> = Pick<ApiOptions<T>, 'txn'>;
export type BulkDeleteOption<T> = Pick<ApiOptions<T>, 'xfilter' | 'txn'>;
export type SortOption<T> = Pick<ApiOptions<T>, 'txn'>;

export interface TransactionResult {
  txn: string;
}

export interface WpxModelStore {
  searchText: string;
  keywords: Any[];
  page: number;
  pagesize: number;
}

export interface UploadOption {
  type: 'cos';
  url: string;
  limit: number;
}

export interface WpxImageInfo {
  format: string;
  height: number;
  width: number;
  size: number;
}
