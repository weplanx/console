import { Any } from '@weplanx/ng';

import { Config, InputData } from './types';

export class Video {
  /**
   * Editor.js API
   */
  private api: Any;
  private config: Config;
  private video?: HTMLVideoElement;
  data: InputData;

  static get toolbox(): Any {
    return {
      title: 'Video',
      icon: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1680519981346" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15231" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M912 302.3L784 376V224c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h592c35.3 0 64-28.7 64-64V648l128 73.7c21.3 12.3 48-3.1 48-27.6V330c0-24.6-26.7-40-48-27.7zM712 792H136V232h576v560z m176-167l-104-59.8V458.9L888 399v226z" p-id="15232"></path><path d="M208 360h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H208c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z" p-id="15233"></path></svg>'
    };
  }

  constructor({ data, api, config }: Any) {
    this.data = {
      assets: data.assets || '',
      url: data.url || ''
    };
    this.api = api;
    this.config = config;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add(this.api.styles.block, 'cdx-media');
    const btn = document.createElement('button');
    btn.classList.add('cdx-button');
    btn.innerText = 'Please select a video';
    btn.onclick = () => {
      this.setVideo();
    };
    wrapper.append(btn);
    this.video = document.createElement('video');
    this.video.controls = true;

    if (this.data.url) {
      this.video!.src = `${this.data.assets}/${this.data.url}`;
      wrapper!.appendChild(this.video!);
      btn.remove();
    } else {
      this.video.onloadstart = () => {
        wrapper!.appendChild(this.video!);
        btn.remove();
        this.config.change();
      };
      this.setVideo();
    }

    return wrapper;
  }

  save(): InputData {
    return this.data;
  }

  private setVideo(): void {
    this.config.resolve(data => {
      this.data = data;
      this.video!.src = `${data.assets}/${data.url}`;
    });
  }
}
