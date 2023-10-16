type ClassInstance = {new (...args: any[]): void};

type Options<T extends ClassInstance> = {
  type: 'one-to-many' | 'many-to-one' | 'one-to-one' | 'many-to-many';
  reference: keyof InstanceType<T>;
};

type Entity = new (...args: any[]) => void;

export type TypeRelaction = <T extends Entity>(
  entity: () => T,
  options: Options<T>,
) => PropertyDecorator;
