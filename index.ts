import './style.css';

import { interval, fromEvent } from './yarxjs-dev';
import { /*startWith,*/ switchMapTo, map, take } from './yarxjs-dev/operators';

const countdownElem = document.getElementById('text');

function countdown(init, delay = 1000) {
  return interval(delay).pipe(
    take(init),
    map((val) => init - val - 1)
    /*startWith(init),*/
  );
}

const click$ = fromEvent(document.getElementById('start'), 'click');
const countdownFrom10$ = countdown(10);
const countdownFrom10OnClick$ = click$.pipe(switchMapTo(countdownFrom10$));

const text = document.getElementById('#text');
countdownFrom10OnClick$.subscribe({
  next: (text) => {
    countdownElem.innerHTML = `${text}`;
  },
});
