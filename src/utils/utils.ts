type Procedure = (...args: any[]) => void;

export const debounce = <F extends Procedure>(
  func: F,
  wait: number,
  immediate: boolean = false,
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};
