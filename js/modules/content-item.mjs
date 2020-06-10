import { menu } from './utils.mjs';

export class ContentItem {
  constructor(el) {
    this.DOM = {
      el: el
    };
    this.DOM.title = this.DOM.el.querySelector('.item__content-title');
    // Create spans out of every letter
    charming(this.DOM.title);
    this.DOM.titleLetters = [...this.DOM.title.querySelectorAll('span')];
    this.titleLettersTotal = this.DOM.titleLetters.length;

    this.DOM.backCtrl = this.DOM.el.querySelector('.item__content-back');
    this.initEvents()
  }

  initEvents() {
    this.DOM.backCtrl.addEventListener('click', (ev) => {
      ev.preventDefault();
      menu.closeItem()
    });
  }

  setCurrent() {
    this.DOM.el.classList.add('item--current');
  }

  resetCurrent() {
    this.DOM.el.classList.remove('item--current');
  }
}
