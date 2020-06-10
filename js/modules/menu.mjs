import { contentItems, MathUtils, activeTilt } from './utils.mjs';
import { Base } from './base.mjs';
import { Column } from './column.mjs';
import { MenuItem } from './menu-item.mjs';


// Content elements
const content = {
  first: document.querySelector('.content--first'),
  second: document.querySelector('.content--second')
};
// content.first inner moving element (reveal/unreveal effect purposes)
const contentMove = content.first.querySelector('.content__move');

// The image columns behind the menu
const columnsWrap = document.querySelector('.columns');
const columnsElems = columnsWrap.querySelectorAll('.column');
const columnsTotal = columnsElems.length;
let columns;

// Preload all the images in the page
imagesLoaded(document.querySelectorAll('.column__img'), {
  background: true
}, () => {
  columns = Array.from(columnsElems, column => new Column(column));
  document.body.classList.remove('loading');
});

export class Menu extends Base {
  constructor(el) {
    super();

    this.DOM = {
      el: el
    };
    // The menu items
    this.DOM.items = document.querySelectorAll('.menu > .menu__item');
    this.menuItems = Array.from(this.DOM.items, item => new MenuItem(item))

    // Init/Bind events
    this.initEvents();
  }

  initEvents() {
    // Clicking a menu item opens up the content item and hides the menu (items)
    for (let menuItem of this.menuItems) {
      menuItem.DOM.el.addEventListener('click', () => this.openItem(menuItem));
    }
  }

  openItem(menuItem) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Get current menu item index
    // this.currentItem = this.menuItems.indexOf(menuItem);
    this.currentItem = parseInt(Math.random() * contentItems.length);

    // Set the content item to current
    const contentItem = contentItems[this.currentItem];
    contentItem.setCurrent();

    // Disable tilts
    activeTilt.columns = false;
    activeTilt.letters = false;

    const duration = 1.2;
    const ease = Sine.easeIn;
    const columnsStagger = 0;

    this.openItemTimeline = new TimelineMax({
        onComplete: () => this.isAnimating = false,
      })
      // Animate columns out
      .staggerTo(columnsElems, duration, {
        ease: ease,
        cycle: {
          y: (i, t) => t.classList.contains('column--bottom') ? columns[i].height + this.winSize.height * .2 : -1 * columns[i].height - this.winSize.height * .2
        },
        opacity: 0
      }, columnsStagger, 0)
      .to(columnsWrap, duration, {
        ease: ease,
        rotation: -2
      }, 0)

      // Animate menu items out
      .staggerTo(menuItem.DOM.letters, duration * .7, {
        ease: ease,
        cycle: {
          y: (i, _) => i % 2 == 0 ? MathUtils.getRandomFloat(-250, -150) : MathUtils.getRandomFloat(150, 250)
        },
        rotation: `+=${MathUtils.getRandomFloat(0,20)}`,
        opacity: 0
      }, -0.01, 0)
      .to(this.menuItems.filter(item => item != menuItem).map(t => t.DOM.el), duration * .5, {
        ease: ease,
        opacity: 0
      }, 0)

      // Animate content.first and contentMove (unreveal effect: both move in different directions)
      .to(content.first, duration * 0.8, {
        ease: Expo.easeOut,
        y: '100%'
      }, duration + duration * columnsStagger * columnsTotal)
      .to(contentMove, duration * 0.8, {
        ease: Expo.easeOut,
        y: '-100%'
      }, duration + duration * columnsStagger * columnsTotal)

      // Animate the content item title letters
      .set(contentItem.DOM.titleLetters, {
        opacity: 0
      }, duration + duration * columnsStagger * columnsTotal)
      .staggerTo(contentItem.DOM.titleLetters, duration, {
        ease: Expo.easeOut,
        startAt: {
          cycle: {
            y: (i, _) => i % 2 == 0 ? MathUtils.getRandomFloat(-35, -15) : MathUtils.getRandomFloat(15, 35),
            rotation: MathUtils.getRandomFloat(-20, 0)
          }
        },
        y: 0,
        rotation: 0,
        opacity: 1
      }, -0.01, duration + duration * columnsStagger * columnsTotal);
  }

  closeItem() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const contentItem = contentItems[this.currentItem];

    const duration = 1;
    const ease = Sine.easeOut;

    this.openItemTimeline = new TimelineMax({
        onComplete: () => {
          activeTilt.columns = true;
          activeTilt.letters = true;
          this.isAnimating = false;
        }
      })
      .staggerTo(contentItem.DOM.titleLetters, duration * 0.6, {
        ease: Expo.easeIn,
        cycle: {
          y: (i, _) => i % 2 == 0 ? MathUtils.getRandomFloat(-35, -15) : MathUtils.getRandomFloat(15, 35),
          rotation: MathUtils.getRandomFloat(-20, 0)
        },
        opacity: 0
      }, 0.01, 0)

      // Animate content.first and contentMove (unreveal effect: both move in different directions)
      .to([content.first, contentMove], duration * 0.6, {
        ease: Expo.easeIn,
        y: '0%',
        onComplete: () => {
          // Reset the content item current classclass
          contentItem.resetCurrent();
        }
      }, 0.2)

      // Animate columns in
      .staggerTo(columnsElems, duration, {
        ease: ease,
        y: 0,
        x: 0,
        //scaleX: 1,
        opacity: 1
      }, 0.02, duration * 0.6)
      .to(columnsWrap, duration, {
        ease: ease,
        rotation: 0
      }, duration * 0.6)

      // Animate menu items in
      .to(this.menuItems[0].DOM.letters, duration * .6, {
        ease: Quint.easeOut,
        y: 0,
        opacity: 1,
        rotation: 0
      }, duration)
      .to(this.DOM.items, duration * .6, {
        ease: ease,
        opacity: 1
      }, duration);
  }
}