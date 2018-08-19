import { Injectable, Renderer2, Inject, Optional, isDevMode, SkipSelf } from '@angular/core';
import { ThemeConfig, LY_THEME_NAME } from './theme-config';
import { CoreTheme } from './core-theme.service';
import { DataStyle, Style } from '../theme.service';
import { InvertMediaQuery } from '../media/invert-media-query';
import { Platform } from '../platform';
import { DOCUMENT } from '@angular/common';

export interface StylesElementMap {
  el: any;
}

export enum TypeStyle {
  Multiple,
  OnlyOne
}
const STYLE_MAP4: StyleMap4 = {};
export interface StyleMap4 {
  [id: string]: {
    styles: StylesFn2<any> | Styles2,
    type: TypeStyle,
    css: {
      [themeName: string]: string
    } | string
  };
}

interface StyleMap03 {
  [id: string]: { // example: lyTabs
    styles: StylesFn2<any> | Styles2,
    media?: string,
    typeStyle?: TypeStyle,
    themes: { // example: minima-dark
      /** Css */
      default?: string,
      [themeName: string]: string
    }
  };
}

const STYLE_MAP_03: StyleMap03 = {} as any;

const STYLE_MAP: {
  [key: string]: Map<string, StylesElementMap>
} = {};
const CLASSES_MAP: {
  [idOrThemeName: string]: {
    [className: string]: string
  } | string
} = {};
const STYLE_KEYS_MAP = {};
let nextId = 0;
// function fn() {
//   return CLASSES_MAP;
// }
// console.log({fn});
// function fn2() {
//   return STYLE_MAP_03;
// }
// console.log({fn2});

@Injectable({
  providedIn: 'root'
})
export class StylesInDocument {
  styles: {
    [themeName: string]: {
      [key: string]: HTMLStyleElement
    }
  } = {};
  styleContainers = new Map<number, HTMLElement>();
}

@Injectable()
export class LyTheme2 {
  config: ThemeConfig;
  _styleMap: Map<string, DataStyle>;
  prefix = 'k';
  elements: {
    [key: string]: HTMLStyleElement
  };
  private _styleMap2: Map<string, StylesElementMap>;

  get classes() {
    return CLASSES_MAP;
  }

  constructor(
    private stylesInDocument: StylesInDocument,
    public core: CoreTheme,
    @Inject(LY_THEME_NAME) themeName,
    @Inject(DOCUMENT) private _document: any
  ) {
    if (themeName) {
      this.setUpTheme(themeName);
    }
  }
  setUpTheme(themeName: string) {
    if (!this.config) {
      this._styleMap2 = themeName in STYLE_MAP
      ? STYLE_MAP[themeName]
      : STYLE_MAP[themeName] = new Map();
      this.config = this.core.get(themeName);
      this._styleMap = new Map<string, DataStyle>();
      this.elements = themeName in this.stylesInDocument.styles
      ? this.stylesInDocument.styles[themeName]
      : this.stylesInDocument.styles[themeName] = {};
      if (!(themeName in CLASSES_MAP)) {
        CLASSES_MAP[themeName] = {};
      }
    }
  }
  setUpStyle<T>(
    key: string,
    styles: Style<T>,
    media?: string,
    invertMediaQuery?: InvertMediaQuery
  ) {
    const name = this.config.name;
    return this.core._ĸreateStyle<T>(this.config, key, styles, this._styleMap, name, this.core.primaryStyleContainer, media, invertMediaQuery);
  }
  setUpStyleSecondary<T>(
    key: string,
    styles: Style<T>,
    media?: string,
    invertMediaQuery?: InvertMediaQuery
  ) {
    const name = this.config.name;
    return this.core._ĸreateStyle<T>(this.config, key, styles, this._styleMap, name, this.core.secondaryStyleContainer, media, invertMediaQuery);
  }

  /**
   * Add a new dynamic style, use only within @Input()
   * @param id Unique id
   * @param style Styles
   * @param el Element
   * @param instance The instance of this, this replaces the existing style with a new one when it changes
   */
  addStyle<T>(id: string, style: Style<T>, el?: any, instance?: string, priority?: number) {
    const newClass = this.addCss(id, style as any, priority);
    if (instance) {
      el.classList.remove(instance);
    }
    el.classList.add(newClass);
    return newClass;
  }
  colorOf(value: string): string {
    return get(this.config, value);
  }
  updateClassName(element: any, renderer: Renderer2, newClassname: string, oldClassname?: string) {
    this.core.updateClassName(element, renderer, newClassname, oldClassname);
  }
  updateClass(element: any, renderer: Renderer2, newClass: string, oldClass?: string) {
    this.updateClassName(element, renderer, newClass, oldClass);
    return newClass;
  }
  setTheme(nam: string) {
    if (!Platform.isBrowser) {
      throw new Error(`\`theme.setTheme('theme-name')\` is only available in browser platform`);
    }
    this.config = this.core.get(nam);
    // this._styleMap2.forEach(dataStyle => {
    //   dataStyle.el.innerText = this._createStyleC ontent2(dataStyle.styles, dataStyle.id);
    // });
    for (const key in STYLE_MAP_03) {
      if (STYLE_MAP_03.hasOwnProperty(key)) {
        const { styles, typeStyle, media } = STYLE_MAP_03[key];
        // this._createStyleContent2(styles, key, typeStyle, this.core.renderer, true, media);
      }
    }
    this._styleMap.forEach((dataStyle) => {
      dataStyle.styleElement.innerText = this.core._createStyleContent(this.config, dataStyle.style, dataStyle.id);
    });
  }

  /**
   * add style, similar to setUpStyle but this only accept string
   * @param id id of style
   * @param css style in string
   */
  private addCss(id: string, css: ((t) => string) | string, priority: number, media?: string): string {
    const newId = `~>${id}`;
    return this._createStyleContent2(css as any, newId, priority, TypeStyle.OnlyOne, this.core.renderer, false, media) as string;
  }

  /**
   * Add new add a new style sheet
   * @param styles styles
   * @param id unique id for style group
   */
  addStyleSheet<T>(styles: StylesFn2<T> | Styles2, id?: string, priority?: number) {
    const newId = id || 'global';
    // const styleElement = this.core.renderer.createElement('style');
    return this._createStyleContent2(styles, newId, priority, TypeStyle.Multiple, this.core.renderer);
  }

  _createStyleContent2<T>(
    styles: StylesFn2<T> | Styles2,
    id: string,
    priority: number,
    type: TypeStyle,
    renderer: Renderer2,
    forChangeTheme?: boolean,
    media?: string
  ) {
    const styleMap = id in STYLE_MAP4
    ? STYLE_MAP4[id]
    : STYLE_MAP4[id] = {
      styles,
      type,
      css: {}
    };
    // const styles2 = this.config.name in this.stylesInDocument.styles
    // ? this.stylesInDocument.styles[this.config.name]
    // : this.stylesInDocument.styles[this.config.name] = {};
    // console.log(
    //   'ccc', typeof styleMap.css !== 'string' && !(id in styleMap.css),
    //   typeof CLASSES_MAP[id] === 'string' || typeof CLASSES_MAP[id] === 'object' || CLASSES_MAP[this.config.name][id]
    // );
    const themeName = this.config.name;
    const isCreated = (id in CLASSES_MAP) || CLASSES_MAP[this.config.name][id];
    if (!isCreated) {
      /** create new style for new theme */
      let css;
      if (typeof styles === 'function') {
        // CLASSES_MAP[id] = {};
        // const themeMap = this.config.name in styleMap.classes
        // ? styleMap.classes[this.config.name]
        // : styleMap.classes[this.config.name] = {};
        // const className = id in (themeMap as Object)
        // ? themeMap[id]
        // : themeMap[id] = this._nextId();
        css = groupStyleToString(styles(this.config), themeName, null, id, type, media);
        styleMap.css[themeName] = css;
      } else {
        /** create a new id for style that does not require changes */
        CLASSES_MAP[id] = createNextId();
        css = groupStyleToString(styles, themeName, null, id, type, media);
        styleMap.css = css;
      }

      // this.core.renderer.appendChild(this.core.primaryStyleContainer, styleElement);
      // if (!this._styleMap2.has(id)) {
      //   const styleElement = this.core.renderer.createElement('style');
      //   const styleText = this.core.renderer.createText(css);
      //   this.core.renderer.appendChild(styleElement, styleText);
      //   this._styleMap2.set(id, {
      //     el: styleElement
      //   });
      // }
      const htmlStyle = this._createElementStyle(
        typeof styleMap.css === 'string'
        ? styleMap.css
        : styleMap.css[themeName]
      );
      this.elements[id] = htmlStyle;
      this.core.renderer.appendChild(this._createStyleContainer(priority), htmlStyle);
    }

    // if (!(id in this.elements)) {
      // const htmlStyle = this._createElementStyle(
      //   typeof styleMap.css === 'string'
      //   ? styleMap.css
      //   : styleMap.css[this.config.name]
      // );
      // this.elements[id] = htmlStyle;
      // this.core.renderer.appendChild(this.core.primaryStyleContainer, htmlStyle);
    // }

    const classes = typeof CLASSES_MAP[id] === 'string'
    ? CLASSES_MAP[id]
    : typeof CLASSES_MAP[id] === 'object'
    ? CLASSES_MAP[id]
    : CLASSES_MAP[this.config.name][id];
    return classes;

    // const style = this._styleMap2.get(id);
    // if (!this.stylesInDocument.styles.has(id)) {
    //   this.stylesInDocument.styles.add(id);
    //   this.core.renderer.appendChild(this.core.primaryStyleContainer, style.el);
    // }
    // if (forChangeTheme && styleMap.themes[this.config.name]) {
    //   style.el.innerText = styleMap.themes[this.config.name];
    // }
  }

  private _createStyleContainer(priority = 0) {
    const { styleContainers } = this.stylesInDocument;
    if (!styleContainers.has(priority)) {
      const el = this.core.renderer.createElement(`ly-style-container-${priority}`);
      this.core.renderer.setAttribute(el, 'ly-s', '');
      styleContainers.set(priority, el);
      if (styleContainers.size === 0) {
        this.core.renderer.insertBefore(this._document.body, el, this._document.body.firstChild);
        return el;
      }
    } else {
      return styleContainers.get(priority);
    }
    const refChild = this.findNode(priority);
    this.core.renderer.insertBefore(this._document.body, styleContainers.get(priority), refChild);
    return styleContainers.get(priority);
    // if (priority > this.highestPriority) {
    //   this.highestPriority = priority;
    // }
  }

  private findNode(index: number) {
    const { styleContainers } = this.stylesInDocument;
    /**
     * (10,8)
     * add item con index 1
     * (10,8,1)
     * return null
     * (10,8,4)
     * add item con index 5
     * (10,8,5,4)
     * return 4
     */
    const keys = (Array.from(styleContainers.keys())).sort();
    // const max = Math.max(...keys);
    const min = Math.max(...keys);
    const key = keys.find(_ => index < _);
    return (key && styleContainers.get(key)) || this.core.firstElement;
  }

  private _createElementStyle(css: string) {
    const styleElement = this.core.renderer.createElement('style');
    const styleText = this.core.renderer.createText(css);
    this.core.renderer.appendChild(styleElement, styleText);
    return styleElement;
  }

}

export interface StyleContainer {
  [key: string]: StyleContainer | string | number;
}

export interface Styles2 {
  [key: string]: StyleContainer;
}
export type StylesFn2<T> = (T) => Styles2;

function groupStyleToString(styles: Styles2, themeName: string, xccxxcxc: string, id: string, typeStyle: TypeStyle, media?: string) {
  // let newKey = '';
  // const string
  // const themeMap = classes[themeName] ? classes[themeName] : classes[themeName] = {};
  if (typeStyle === TypeStyle.OnlyOne) {
    /** use current class or set new */
    const className = CLASSES_MAP[id] || (CLASSES_MAP[themeName][id] = createNextId());
    if (typeof styles === 'string') {
      const css = `.${className}{${styles}}`;
      return media ? toMedia(css, media) : css;
    } else {
      return styleToString(styles, `.${className}`);
    }
  }
  let content = '';
  // const classesMap = id in themeMap
  // ? themeMap[id]
  // : themeMap[id] = {};
  const classes = CLASSES_MAP[id] = {};
  for (const key in styles) {
    if (styles.hasOwnProperty(key)) {
      const value = styles[key];
      if (typeof value === 'object') {
        const className = classes[key] = !isDevMode() ? toClassNameValid(`${id}__${key}`) : `e${(nextId++).toString(36)}`;
        const style = styleToString(value as Styles2, `.${className}`);
        content += style;
      } else {
        console.log('value is string', value);
      }
    }
  }
  return content;
}

function createKeyFrame(name: string, ob: Object) {
  let content = `@keyframes ${name}{`;
  for (const key in ob) {
    if (ob.hasOwnProperty(key)) {
      const element = ob[key];
      content += `${key}% ${styleToString(element, '')}`;
    }
  }
  content += `}`;
  return content;
}
// console.log('keyframe', createKeyFrame('myanimation', keyFrameObject));

/**
 * {color:'red'} to .className{color: red}
 */
function styleToString(ob: Object, className?: string, parentClassName?: string) {
  let content = '';
  let keyAndValue = '';
  for (const styleKey in ob) {
    if (ob.hasOwnProperty(styleKey)) {
      const element = ob[styleKey];
      if (typeof element === 'object') {
        content += styleToString(element as Styles2, styleKey, className);
      } else {
        // const styleKeyHyphenCase = toHyphenCaseCache(styleKey);
        // const styleValue = styleKeyHyphenCase === 'font-size' && typeof element === 'number'
        // ? this.config.pxToRem(element)
        // : element;
        keyAndValue += `${toHyphenCaseCache(styleKey)}:${element};`;
      }
    }
  }
  if (className) {
    let newClassName = '';
    if (parentClassName) {
      newClassName += className.indexOf('&') === 0 ? `${parentClassName}${className.slice(1)}` : `${parentClassName} .${className}`;
    } else {
      newClassName += className;
    }
    content += `${newClassName}`;
  }
  content += `{${keyAndValue}}`;
  return content;
}


function get(obj: Object, path: any): string {
  const _path: string[] = path instanceof Array ? path : path.split(':');
  for (let i = 0; i < _path.length; i++) {
    obj = obj[_path[i]] || path;
  }
  return typeof obj === 'string' ? obj as string : obj['default'] as string;
}

export function toHyphenCase(str: string) {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

function toClassNameValid(str: string) {
  const s = str.replace(/[\W]/g, '');
  return toHyphenCase(s[0].toLowerCase() + s.slice(1));
}

function toHyphenCaseCache(str: string) {
  return str in STYLE_KEYS_MAP
  ? STYLE_KEYS_MAP[str]
  : STYLE_KEYS_MAP[str] = toHyphenCase(str);
}

export function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

function toMedia(css: string, media: string) {
  return `@media ${media}{${css}}`;
}

function createNextId() {
  return `e${(nextId++).toString(36)}`;
}

