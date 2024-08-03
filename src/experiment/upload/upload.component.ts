import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { PicturesInputComponent } from '@common/components/filebrowser-input/pictures-input.component';
import { VideosInputComponent } from '@common/components/filebrowser-input/videos-input.component';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { WpxUploadAvatarComponent } from '@weplanx/ng/upload';

@Component({
  standalone: true,
  imports: [ShareModule, WpxUploadAvatarComponent, PicturesInputComponent, VideosInputComponent],
  selector: 'x-upload',
  templateUrl: './upload.component.html'
})
export class UploadComponent {
  form: FormGroup = this.fb.group({
    avatar: [null],
    pictures: [[]],
    videos: [[]]
  });

  constructor(private fb: FormBuilder) {}

  submit(data: Any): void {
    console.log(data);
  }

  reset(): void {
    this.form.reset({
      avatar: null,
      pictures: [],
      videos: []
    });
  }

  mock(): void {
    this.form.patchValue({
      avatar: 'weplanx_dev/20230803/3ba7f853-6f84-4950-bdf9-c86e97d8729c',
      pictures: [
        'weplanx_dev/20230802/d2531b06-15ff-4deb-a69a-026a07297789',
        'weplanx_dev/20230802/5958a955-e242-4d13-835a-c941650ac254?imageMogr2/cut/4006x1860x1075x162/thumbnail/0x100',
        'weplanx_dev/20230802/5eb191b8-252f-406b-84c7-de27c7160ef0'
      ],
      videos: [
        'weplanx_dev/20230803/84a10a3f-fe16-42d6-b8d4-b4e0532bb44b',
        'weplanx_dev/20230803/7409158c-e2af-41a3-977c-58b1c1540685'
      ]
    });
  }
}
