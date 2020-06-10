import { ContentItem } from './content-item.mjs';
import { Menu } from './menu.mjs';

const getMousePos = (ev) => {
  let posX = 0;
  let posY = 0;

  if (!ev) e = window.event;
  if (ev.pageX || ev.pageY)   {
    posX = ev.pageX;
    posY = ev.pageY;
  }

  else if (ev.clientX || ev.clientY)  {
    posX = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posY = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  return { x : posX, y : posY };
};

const MathUtils = {
  lineEq: (y2, y1, x2, x1, currentVal) => {
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    return m * currentVal + b;
  },
  lerp: (a, b, n) => (1 - n) * a + n * b,
  getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
};

let activeTilt = {
  columns: true,
  letters: true,
}

// Content elements
const content = {
  first: document.querySelector('.content--first'),
  second: document.querySelector('.content--second')
};

// The Menu
const menu = new Menu(content.second.querySelector('.menu'));

// Content items
const contentItems = Array.from(content.second.querySelectorAll('.item'), item => new ContentItem(item));

export { activeTilt, getMousePos, MathUtils, menu, content, contentItems };
