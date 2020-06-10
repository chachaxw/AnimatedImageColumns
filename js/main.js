/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2019, Codrops
 * http://www.codrops.com
 */
import { Cursor } from './modules/cursor.mjs';

// Custom mouse cursor
const cursor = new Cursor(document.querySelector('.cursor'));

// Activate the enter/leave/click methods of the custom cursor when hovering in/out on every <a> and when clicking anywhere
[...document.querySelectorAll('a')].forEach((link) => {
  link.addEventListener('mouseenter', () => cursor.emit('enter'));
  link.addEventListener('mouseleave', () => cursor.emit('leave'));
});