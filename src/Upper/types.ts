type ClassInstance = { new (...args: any[]): void };

export type Entities = { [key: string]: ClassInstance };

export type UpperOptions<T extends Entities> = {
  name: string;
  entities: T;
};

export type FieldsSelect<T extends ClassInstance> = Partial<
  Record<keyof InstanceType<T>, boolean>
>;

export type QueryOptions<
  T extends ClassInstance,
  Fields extends FieldsSelect<T>
> = {
  select?: Fields;
  relations?: string;
};

export type OneWhere<T> = Partial<{
  [key in keyof T]: T[key];
}>;

type ResultType<T, Fields> = {
  [K in keyof Fields]: K extends keyof T ? T[K] : never;
};

type Expand<T> = T extends unknown ? { [K in keyof T]: T[K] } : never;

export type QueryResult<
  T extends ClassInstance,
  Fields extends FieldsSelect<T>
> = Expand<ResultType<InstanceType<T>, Fields>>;
