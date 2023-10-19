import React, { createElement } from 'react';
import type { ObserverFunction, ObserverProps } from './types';
import { InstantReaction } from '../../register/InstantReaction';
import { generateUUID } from '../../helpers';

const instantReaction = InstantReaction.getInstance();

export class Observer extends React.PureComponent<
  ObserverProps,
  { id: string }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      id: generateUUID(),
    };

    instantReaction.register(this.state.id, this.forceUpdate.bind(this));
  }

  componentWillUnmount() {
    if (instantReaction.has(this.state.id)) {
      instantReaction.remove(this.state.id);
    }
  }

  render() {
    const { children } = this.props;

    const result = children();

    return result;
  }
}

export const observer: ObserverFunction = (Component) => {
  const reaction = () => createElement(Observer, { children: Component });

  return reaction;
};
