import type { DispatchWithoutAction } from 'react';

export class InstantReaction {
  private static instance: InstantReaction | null = null;

  reaction: DispatchWithoutAction | null = null;

  private constructor() {}

  public static getInstance(): InstantReaction {
    if (!InstantReaction.instance) {
      InstantReaction.instance = new InstantReaction();
    }
    return InstantReaction.instance;
  }

  register(reaction: DispatchWithoutAction) {
    this.reaction = reaction;
  }

  remove() {
    this.reaction = null;
  }
}
