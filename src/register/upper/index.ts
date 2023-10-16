import { type DispatchWithoutAction } from 'react';
import { InstantReaction } from '../InstantReaction';

let instantReaction = InstantReaction.getInstance();

export function upper(initialValue: any) {
  const observed = initialValue;
  const _reactions = new Set<DispatchWithoutAction>();

  if (initialValue) {
    Object.assign(observed, initialValue);
  }

  const proxy = new Proxy(observed, {
    get(obj, prop) {
      if (instantReaction.reaction) {
        _reactions.add(instantReaction.reaction);
      }

      return obj[prop];
    },
    set(obj, prop, value) {
      if (value !== observed[prop]) {
        obj[prop] = value;
        _reactions.forEach((reaction) => reaction());

        return true;
      }

      return true;
    },
  });

  return proxy;
}
