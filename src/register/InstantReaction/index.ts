import type { DispatchWithoutAction } from 'react';

export class InstantReaction {
  private static instance: InstantReaction | null = null;

  _reactions: Map<string, DispatchWithoutAction> = new Map();

  private constructor() {}

  public static getInstance(): InstantReaction {
    if (!InstantReaction.instance) {
      InstantReaction.instance = new InstantReaction();
    }
    return InstantReaction.instance;
  }

  has(id: string) {
    return this._reactions.has(id);
  }

  register(id: string, reaction: DispatchWithoutAction) {
    this._reactions.set(id, reaction);
  }

  remove(id: string) {
    this._reactions.delete(id);
  }
}
