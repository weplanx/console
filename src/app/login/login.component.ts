import { Component } from '@angular/core';

import { AppService } from '@app';
import { BlankPageComponent } from '@common/components/page/blank-page.component';
import { ShareModule } from '@common/share.module';

@Component({
  standalone: true,
  imports: [ShareModule, BlankPageComponent],
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(private app: AppService) {}

  lark(): void {
    this.app.oauth().subscribe(v => {
      window.location.href = v;
    });
  }
}
