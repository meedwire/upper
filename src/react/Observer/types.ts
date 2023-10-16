import { type ReactElement } from 'react';

export interface ObserverProps {
  children(): ReactElement | ReactElement[];
}

export type ObserverFunction = (Component: () => JSX.Element) => any;
