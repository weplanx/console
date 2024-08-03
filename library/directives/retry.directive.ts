import { HttpClient } from '@angular/common/http';
import { Directive, Input, OnInit, Renderer2 } from '@angular/core';
import { delay, fromEvent, retry, switchMap } from 'rxjs';

import { NzImageDirective } from 'ng-zorro-antd/image';

@Directive({
  standalone: true,
  selector: 'img[wpxRetry]'
})
export class WpxRetryDirective implements OnInit {
  @Input() wpxRetryCount = 5;
  @Input() wpxDelay = 5000;

  constructor(
    private image: NzImageDirective,
    private http: HttpClient,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    fromEvent(this.image.backLoadImage, 'error')
      .pipe(
        delay(this.wpxDelay),
        switchMap(() =>
          this.http.head(this.image.nzSrc, { observe: 'response' }).pipe(
            retry({
              delay: this.wpxDelay,
              count: this.wpxRetryCount
            })
          )
        )
      )
      .subscribe(() => {
        this.renderer.setAttribute(this.image.backLoadImage, 'src', this.image.nzSrc);
      });
  }
}
