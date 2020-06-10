
const body = document.body;
const docEl = document.documentElement;

export class Base {
  constructor() {
    this.winSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    window.addEventListener('resize', this.calcWinSize);

    this.mousePos = {
      x: this.winSize.width / 2,
      y: this.winSize.height / 2,
    };

    window.addEventListener('mousemove', ev => {
      this.mousePos = this.getMousePos(ev);
    });
  }

  calcWinSize = () => {
    this.winSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  // Gets the mouse position. From http://www.quirksmode.org/js/events_properties.html#position
  getMousePos = (ev) => {
    let posX = 0;
    let posY = 0;
  
    if (!ev) e = window.event;
    if (ev.pageX || ev.pageY)   {
      posX = ev.pageX;
      posY = ev.pageY;
    }
  
    else if (ev.clientX || ev.clientY)  {
      posX = ev.clientX + body.scrollLeft + docEl.scrollLeft;
      posY = ev.clientY + body.scrollTop + docEl.scrollTop;
    }
  
    return {
      x: posX,
      y: posY,
    };
  }
}