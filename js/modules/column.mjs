import { MathUtils, activeTilt } from './utils.mjs';
import { Base } from './base.mjs';

// Vertical images column
export class Column extends Base {
  constructor(el) {
    super();

    this.DOM = {
      el: el
    };

    // The column's height
    const rect = this.DOM.el.getBoundingClientRect();
    this.height = rect.height;

    // Check if the column starts on the top of the viewport or if it ends on the bottom of the viewport. This will define the column's translation direction.
    this.isBottom = this.DOM.el.classList.contains('column--bottom');

    // Tilt the column on mousemove.
    this.tilt();
  }

  tilt() {
    let translationVal = {
      tx: 0,
      ty: 0
    };
    const randX = MathUtils.getRandomFloat(5, 20);
    const rY1 = this.isBottom ? MathUtils.getRandomFloat(10, 30) : MathUtils.getRandomFloat(30, 80);
    const rY2 = this.isBottom ? MathUtils.getRandomFloat(30, 80) : MathUtils.getRandomFloat(10, 30);

    const render = () => {
      if (activeTilt.columns) {
        translationVal.tx = MathUtils.lerp(translationVal.tx, MathUtils.lineEq(-randX, randX, this.winSize.width, 0, this.mousePos.x), 0.03);
        translationVal.ty = MathUtils.lerp(translationVal.ty, MathUtils.lineEq(this.isBottom ? -rY1 : rY2, this.isBottom ? rY2 : -rY1, this.winSize.height, 0, this.mousePos.y), 0.03);

        gsap.set(this.DOM.el, {
          x: translationVal.tx,
          y: translationVal.ty,
          rotation: 0.01
        });
      } else {
        translationVal = {
          tx: 0,
          ty: 0
        };
      }
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }
}