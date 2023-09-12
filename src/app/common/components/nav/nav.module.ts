import { NgModule } from '@angular/core';

import { NavComponent } from '@common/components/nav/nav.component';
import { ProfileModule } from '@common/components/nav/profile/profile.module';
import { TranslationModule } from '@common/components/translation/translation.module';
import { ShareModule } from '@common/share.module';

@NgModule({
  imports: [ShareModule, ProfileModule, TranslationModule],
  declarations: [NavComponent],
  exports: [NavComponent]
})
export class NavModule {}
