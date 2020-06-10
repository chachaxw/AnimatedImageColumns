import { Base } from './base.mjs';
import { Cursor } from './cursor.mjs';
import { MathUtils, activeTilt } from './utils.mjs';

const body = document.body;
const docEl = document.documentElement;

// A Menu Item
export class MenuItem extends Base {
  constructor(el) {
    super();
    
    this.DOM = {
      el: el
    };

    // Create spans out of every letter
    charming(this.DOM.el);
    this.DOM.letters = [...this.DOM.el.querySelectorAll('span')];
    this.lettersTotal = this.DOM.letters.length;

    // Total number of letters that move when hovering and moving the mouse
    this.totalRandomLetters = 3;
    this.totalRandomLetters = this.totalRandomLetters <= this.lettersTotal ? this.totalRandomLetters : this.lettersTotal
    // The amount that they move (y-axis)
    this.lettersTranslations = Array.from({
      length: this.totalRandomLetters
    }, _ => {
      const tr = MathUtils.getRandomFloat(10, 50);
      return [-tr, tr];
    });
    this.lettersRotations = Array.from({
      length: this.totalRandomLetters
    }, _ => {
      const rr = MathUtils.getRandomFloat(0, 6);
      return [-rr, rr];
    });

    // Init/Bind events
    this.initEvents();
  }

  initEvents() {
    // Initialize the random letters of the menu item that move when hovering and moving the mouse
    this.mouseenterFn = _ => {
      const shuffled = [...this.DOM.letters].sort(() => 0.5 - Math.random());
      this.DOM.randLetters = shuffled.slice(0, this.totalRandomLetters);
    };
    // Move the random letters up and down when moving the mouse
    this.mousemoveFn = (ev) => requestAnimationFrame(() => this.tilt(ev));
    // Reset the position of the random letters
    this.mouseleaveFn = _ => this.resetTilt();
    this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
    this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
    this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
  }

  tilt(ev) {
    if (!activeTilt.letters) return;
    // Document scrolls
    const docScrolls = {
      left: body.scrollLeft + docEl.scrollLeft,
      top: body.scrollTop + docEl.scrollTop
    };
    const bounds = this.DOM.el.getBoundingClientRect();
    // Mouse position relative to the main element (this.DOM.el)
    const relMousePos = {
      x: this.mousePos.x - bounds.left - docScrolls.left,
      y: this.mousePos.y - bounds.top - docScrolls.top,
    };

    for (const [index, letter] of this.DOM.randLetters.entries()) {
      gsap.to(letter, 3, {
        ease: Expo.easeOut,
        y: MathUtils.lineEq(this.lettersTranslations[index][1], this.lettersTranslations[index][0], bounds.height, 0, relMousePos.y),
        rotation: MathUtils.lineEq(this.lettersRotations[index][1], this.lettersRotations[index][0], bounds.height, 0, relMousePos.y),
      });
    }
  }

  resetTilt() {
    if (!activeTilt.letters) return;

    new TimelineMax()
      .to(this.DOM.randLetters, 0.2, {
        ease: Quad.easeOut,
        opacity: 0,
      }, 0)
      .staggerTo(this.DOM.randLetters, MathUtils.getRandomFloat(0.5, 0.7), {
        ease: Elastic.easeOut.config(1, 0.4),
        startAt: {
          opacity: 0
        },
        y: '0%',
        rotation: 0,
        opacity: 1
      }, 0.02, 0.2);
  }
}