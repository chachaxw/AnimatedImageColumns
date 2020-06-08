// Custom cursor
// export class Cursor {
//   constructor(el) {
//     this.DOM = {el: el};
//     this.DOM.circle = this.DOM.el.querySelector('.cursor__inner--circle');
//     this.bounds = this.DOM.circle.getBoundingClientRect();
//     this.lastMousePos = {x:0, y:0};
//     this.scale = 1;
//     this.lastScale = 1;
//     this.lastY = 0;
//     requestAnimationFrame(() => this.render());
//   }

//   render() {
//     this.lastMousePos.x = MathUtils.lerp(this.lastMousePos.x, mousepos.x - this.bounds.width/2, 0.15);
//     this.lastMousePos.y = MathUtils.lerp(this.lastMousePos.y, mousepos.y - this.bounds.height/2, 0.15);
//     this.direction = this.lastY - mousepos.y > 0 ? 'up' : 'down';
//     this.lastScale = MathUtils.lerp(this.lastScale, this.scale, 0.15);
//     this.DOM.circle.style.transform = `translateX(${(this.lastMousePos.x)}px) translateY(${this.lastMousePos.y}px) scale(${this.lastScale})`;
//     this.lastY = mousepos.y;
//     requestAnimationFrame(() => this.render());
//   }

//   enter() {
//     this.scale = 1.5;
//   }

//   leave() {
//     this.scale = 1;
//   }

//   click() {
//     this.lastScale = .4;
//   }
// }

import { MathUtils } from './utils';

export class Cursor {
  constructor(el) {
    super();

    this.DOM = { el: el };
    this.DOM.el.style.opacity = 0;
    this.DOM.circleInner = this.DOM.el.querySelector('.cursor__inner');

    this.filterId = '#filter-1';
    this.DOM.feDisplacementMap = document.querySelector(`${this.filterId} > feDisplacementMap`);

    this.primitiveValues = {scale: 0};

    this.createTimeline();

    this.bounds = this.DOM.el.getBoundingClientRect();

    this.renderedStyles = {
      tx: {previous: 0, current: 0, amt: 0.14},
      ty: {previous: 0, current: 0, amt: 0.14},
      radius: {previous: 50, current: 50, amt: 0.14}
    };

    this.listen();

    this.onMouseMoveEv = () => {
      this.renderedStyles.tx.previous = this.renderedStyles.tx.current = mouse.x - this.bounds.width / 2;
      this.renderedStyles.ty.previous = this.renderedStyles.ty.previous = mouse.y - this.bounds.height / 2;
      TweenMax.to(this.DOM.el, {duration: 0.9, ease: 'Power3.easeOut', opacity: 1});
      requestAnimationFrame(() => this.render());
      window.removeEventListener('mousemove', this.onMouseMoveEv);
    }
    window.addEventListener('mousemove', this.onMouseMoveEv);
  }

  render() {
    this.renderedStyles['tx'].current = mouse.x - this.bounds.width/2;
    this.renderedStyles['ty'].current = mouse.y - this.bounds.height/2;

    for (const key in this.renderedStyles ) {
      this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
    }
  
    this.DOM.el.style.transform = `translateX(${(this.renderedStyles['tx'].previous)}px) translateY(${this.renderedStyles['ty'].previous}px)`;
    this.DOM.circleInner.setAttribute('r', this.renderedStyles['radius'].previous);

    requestAnimationFrame(() => this.render());
  }

  createTimeline() {
    // init timeline
    this.tl = TweenMax.timeline({
      paused: true,
      onStart: () => {
          this.DOM.circleInner.style.filter = `url(${this.filterId}`;
      },
      onUpdate: () => {
          this.DOM.feDisplacementMap.scale.baseVal = this.primitiveValues.scale;
      },
      onComplete: () => {
          this.DOM.circleInner.style.filter = 'none';
      }
    })
    .to(this.primitiveValues, { 
      duration: 0.1,
      ease: 'Expo.easeOut',
      startAt: {scale: 0},
      scale: 60
    })
    .to(this.primitiveValues, { 
      duration: 0.6,
      ease: 'Power3.easeOut',
      scale: 0
    });
  }

  enter() {
    this.renderedStyles['radius'].current = 120;
    this.tl.restart();
  }

  leave() {
    this.renderedStyles['radius'].current = 50;
    this.tl.progress(1).kill();
  }

  listen() {
    this.on('enter', () => this.enter());
    this.on('leave', () => this.leave());
  }
}