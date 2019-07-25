import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// function createClone() {
//   const cardDOM = document.querySelector('#card-3-10');
//   if (!cardDOM) return;
//   const deckArea = document.querySelector(
//     '#deck-area'
//   ) as (HTMLDivElement | null);
//   if (!deckArea) return;

//   const { top, left, width, height } = cardDOM.getBoundingClientRect();
//   const clone = document.createElement('div');
//   clone.style.position = 'absolute';
//   clone.style.left = left + 'px';
//   clone.style.top = top + 'px';
//   clone.style.width = '100px';
//   clone.style.height = '140px';
//   clone.style.background = 'rgba(255,0,0,0.3)';
//   clone.style.transformOrigin = 'left top';
//   clone.style.transform = deckArea.style.transform;
//   clone.style.zIndex = '999999';
//   document.body.appendChild(clone);
// }

// setTimeout(createClone, 3000);
