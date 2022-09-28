import { Observable } from '.';

export function map(projection) {
  return function (source) {
    return new Observable((observer) => {
      const subscription = source.subscribe({
        next: (value) => {
          observer.next(projection(value));
        },
        error: (e) => {
          observer.error(e);
        },
        complete: () => {
          observer.complete();
        },
      });
      return () => {
        subscription?.unsubscribe();
      };
    });
  };
}

export function take(maxEvents) {
  return function (source: Observable) {
    return new Observable((observer) => {
      let counter = 0;
      const subscription = source.subscribe({
        next(value) {
          observer.next(value);
          if (++counter === maxEvents) {
            subscription?.unsubscribe();
            observer.complete();
          }
        },
        error(e) {
          observer.error();
        },
        complete() {
          observer.complete();
        },
      });
      return () => {
        subscription?.unsubscribe();
      };
    });
  };
}

export function switchMapTo(destination: Observable) {
  return function (source: Observable) {
    return new Observable((observer) => {
      let innerSubscription;
      let innerCompleted = true;
      let isComplete = false;
      const checkCompletion = () =>
        isComplete && innerCompleted && observer.complete();
      const subscription = source.subscribe({
        next: (value) => {
          innerSubscription?.unsubscribe();
          innerSubscription = destination.subscribe({
            next(value) {
              observer.next(value);
            },
            error(e) {
              observer.error();
            },
            complete() {
              innerCompleted = true;
              checkCompletion();
            },
          });
        },
        error: (e) => {
          observer.error(e);
        },
        complete: () => {
          isComplete = true;
          checkCompletion();
        },
      });
      return () => {
        innerSubscription?.unsubscribe();
        subscription?.unsubscribe();
      };
    });
  };
}
