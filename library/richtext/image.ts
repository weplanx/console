import { Any } from '@weplanx/ng';

import { Config, InputData } from './types';

export class Image {
  /**
   * Editor.js API
   */
  private api: Any;
  private config: Config;
  private image?: HTMLImageElement;
  data: InputData;

  static get toolbox(): Any {
    return {
      title: 'Image',
      icon: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1680519881710" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15059" width="20" height="20" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32z m-40 632H136v-39.9l138.5-164.3 150.1 178L658.1 489 888 761.6V792z m0-129.8L664.2 396.8c-3.2-3.8-9-3.8-12.2 0L424.6 666.4l-144-170.7c-3.2-3.8-9-3.8-12.2 0L136 652.7V232h752v430.2z" p-id="15060"></path><path d="M304 456c48.6 0 88-39.4 88-88s-39.4-88-88-88-88 39.4-88 88 39.4 88 88 88z m0-116c15.5 0 28 12.5 28 28s-12.5 28-28 28-28-12.5-28-28 12.5-28 28-28z" p-id="15061"></path></svg>'
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
    btn.innerText = 'Please select a picture';
    btn.onclick = () => {
      this.setImage();
    };
    wrapper.append(btn);
    this.image = document.createElement('img');

    if (this.data.url) {
      this.image.src = `${this.data.assets}/${this.data.url}`;
      wrapper!.appendChild(this.image!);
      btn.remove();
    } else {
      this.image.onload = () => {
        wrapper!.appendChild(this.image!);
        btn.remove();
        this.config.change();
      };
      this.setImage();
    }

    return wrapper;
  }

  save(): InputData {
    return this.data;
  }

  private setImage(): void {
    this.config.resolve(data => {
      this.data = data;
      this.image!.src = `${data.assets}/${data.url}`;
    });
  }
}
