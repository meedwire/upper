import React, { createElement } from 'react';
import type { ObserverFunction, ObserverProps } from './types';
import { InstantReaction } from '../../register/InstantReaction';

const instantReaction = InstantReaction.getInstance();

export class Observer extends React.Component<ObserverProps> {
  constructor(props: any) {
    super(props);
    instantReaction.register(this.forceUpdate.bind(this));
  }

  componentDidUpdate() {
    instantReaction.register(this.forceUpdate.bind(this));
  }

  componentWillUnmount() {
    if (instantReaction.reaction) {
      instantReaction.remove();
    }
  }

  render() {
    const { children } = this.props;

    const result = children();
    instantReaction.remove();

    return result;
  }
}

export const observer: ObserverFunction = (Component) => {
  const reaction = () => createElement(Observer, { children: Component });

  return reaction;
};
