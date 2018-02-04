import { Directive, ElementRef, Input, OnInit, AfterViewInit, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PrismPipe } from '../pipes/prism/prism.pipe';

@Directive({
  selector: '[prism], prism'
})
export class PrismDirective implements AfterViewInit {
  private _language: string;
  private _content: HTMLElement;
  @Input('language')
  set language(val: string) {
    this._language = val;
    this.transformData(this._language);
  }
  @Input('src')
  set src(val: string) {
    this._language = val;
  }

  constructor(
    private _elementRef: ElementRef,
    private _prismPipe: PrismPipe,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
    this._elementRef.nativeElement.style.display = 'none';
    const div = document.createElement('div');
    this._content = div;
    this._elementRef.nativeElement.after(this._content);
    }
  }
  transformData(lang: string) {
    const data = this._elementRef.nativeElement.innerHTML;
    this._content.innerHTML = this._prismPipe.transform(data, lang);
  }
  ngAfterViewInit() {
    if (this._language) {
      this.transformData(this._language);
    }
  }

}