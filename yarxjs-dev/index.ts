const compose = (f, g) => (x) => g(f(x));
const pipe = (...args) => args.reduce(compose);

export interface Observer {
  next(event: any): void;
  error(error: any): void;
  complete(): void;
}

export class Observable {
  private _subscribe;
  private _unsubscribe;
  private _stopped = true;
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  _stop() {
    this._stopped = true;
    setTimeout(() => {
      this._unsubscribe();
    });
  }
  subscribe(observer) {
    this._stopped = false;
    this._unsubscribe = this._subscribe({
      next: (value) => {
        if (!this._stopped) {
          observer.next(value);
        }
      },
      complete: () => {
        if (!this._stopped) {
          observer.complete();
          this._stop();
        }
      },
      error: () => {
        if (!this._stopped) {
          observer.error();
          this._stop();
        }
      },
    });
    return { unsubscribe: this._unsubscribe };
  }

  pipe(...operators) {
    return pipe(...operators)(this);
  }
}

export function fromEvent(target, eventName): Observable {
  return new Observable((observer: Observer) => {
    const listener = observer.next;
    target.addEventListener(eventName, listener);
    return () => {
      target.removeListener(listener);
    };
  });
}

export const interval = (period) => {
  return new Observable((observer) => {
    let tick = 0;
    const timer = setInterval((event) => {
      observer.next(tick++);
    }, period);

    return () => {
      clearInterval(timer);
    };
  });
};
