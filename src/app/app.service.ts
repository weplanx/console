import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subscription, switchMap, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { Project } from '@common/models/project';
import { User } from '@common/models/user';
import { ProjectsService } from '@common/services/projects.service';
import { CollaborationOption, SetUserDto, UnsetUserKey } from '@common/types';
import { Any, AnyDto, R, UploadOption } from '@weplanx/ng';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  user = signal<AnyDto<User> | null>(null);
  context?: string;
  contextData?: AnyDto<Project>;

  private refreshTokenSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private projects: ProjectsService
  ) {}

  ping(): Observable<R> {
    return this.http.get('');
  }

  login(email: string, password: string): Observable<R> {
    return this.http.post('login', { email, password });
  }

  getLoginSms(phone: string): Observable<R> {
    return this.http.get('login/sms', { params: { phone } });
  }

  loginSms(phone: string, code: string): Observable<R> {
    return this.http.post('login/sms', { phone, code });
  }

  loginTotp(email: string, code: string): Observable<R> {
    return this.http.post('login/totp', { email, code });
  }

  getForgetCode(email: string): Observable<R> {
    return this.http.get('forget_code', { params: { email } });
  }

  forgetReset(email: string, code: string, password: string): Observable<R> {
    return this.http.post('forget_reset', { email, code, password });
  }

  verify(): Observable<HttpResponse<R>> {
    return this.http.get('verify', { observe: 'response' });
  }

  autoRefreshToken(): void {
    this.stopRefreshToken();
    this.refreshTokenSubscription = timer(0, 3200 * 1000)
      .pipe(
        switchMap(() => this.http.get<{ code: string }>('refresh_code')),
        switchMap(v =>
          this.http.post('refresh_token', {
            code: v.code
          })
        )
      )
      .subscribe(() => {
        console.debug('refresh_token');
      });
  }

  stopRefreshToken(): void {
    this.refreshTokenSubscription?.unsubscribe();
  }

  logout(): Observable<R> {
    return this.http.post('logout', {});
  }

  getUploadOption(): Observable<UploadOption> {
    return this.http.get<UploadOption>('options', {
      params: { type: 'upload' }
    });
  }

  getCollaborationOption(): Observable<CollaborationOption> {
    return this.http.get<CollaborationOption>('options', {
      params: { type: 'collaboration' }
    });
  }

  oauth(action?: string): Observable<string> {
    const state = JSON.stringify({
      action
      // locale: this.locale
    });
    return this.getCollaborationOption().pipe(
      map(v => {
        const redirect_uri = encodeURIComponent(v.redirect);
        return `${v.url}?redirect_uri=${redirect_uri}&app_id=${v.app_id}&state=${state}`;
      })
    );
  }

  getUser(): Observable<AnyDto<User>> {
    return this.http.get<AnyDto<User>>('user').pipe(
      map(v => {
        this.user.set(v);
        return v;
      })
    );
  }

  setUser(data: SetUserDto): Observable<R> {
    return this.http.patch('user', data);
  }

  setUserPassword(old: string, password: string): Observable<R> {
    return this.http.post(`user/password`, { old, password });
  }

  getUserPhoneCode(phone: string): Observable<R> {
    return this.http.get(`user/phone_code`, { params: { phone } });
  }

  setUserPhone(phone: string, code: string): Observable<R> {
    return this.http.post(`user/phone`, { phone, code });
  }

  getTotp(): Observable<R> {
    return this.http.get(`user/totp`);
  }

  setUserTotp(totp: string, tss: string[]): Observable<R> {
    return this.http.post(`user/totp`, { totp, tss });
  }

  unsetUser(key: UnsetUserKey): Observable<R> {
    return this.http.delete(`user/${key}`);
  }

  generateSecret(): Observable<Any> {
    return this.http.get('options', {
      params: { type: 'generate-secret' }
    });
  }

  fetchContextData(): Observable<AnyDto<Project>> {
    return this.projects.findOne({ namespace: this.context }).pipe(
      map(data => {
        this.contextData = data;
        return data;
      })
    );
  }

  destoryContext(): void {
    this.context = undefined;
    this.contextData = undefined;
  }
}
