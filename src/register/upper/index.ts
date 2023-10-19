import { InstantReaction } from '../InstantReaction';
import type { UpperRegister } from './types';

export const upper: UpperRegister = (initialValue, onUpdate) => {
  const instantReaction = InstantReaction.getInstance();
  const observed = initialValue;

  const proxy = new Proxy(observed, {
    get(obj, prop) {
      return obj[prop];
    },
    set(obj, prop, value) {
      if (value !== observed[prop]) {
        obj[prop] = value;

        instantReaction._reactions.forEach((reaction) => reaction());

        onUpdate(obj, prop, value);

        return true;
      }

      return true;
    },
  });

  return proxy;
};
