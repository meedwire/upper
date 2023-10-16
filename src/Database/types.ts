type ClassInstance = {new (...args: any[]): void};

export type Entities = Record<string, ClassInstance>;

export type UpperOptions<T extends Entities> = {
  name: string;
  entities: T;
};

export interface DatabaseSelectOptions {
  select?: Record<string, boolean>;
  relations?: string;
  where: {
    [key: string]: string;
  };
}
