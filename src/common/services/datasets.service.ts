import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Dataset, DatasetCreateDto } from '@common/models/dataset';

@Injectable({ providedIn: 'root' })
export class DatasetsService {
  constructor(private http: HttpClient) {}

  lists(name: string): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(`datasets`, {
      params: {
        name
      }
    });
  }

  create(data: DatasetCreateDto): Observable<void> {
    return this.http.post<void>(`datasets/create`, data);
  }

  delete(name: string): Observable<void> {
    return this.http.delete<void>(`datasets/${name}`);
  }
}
