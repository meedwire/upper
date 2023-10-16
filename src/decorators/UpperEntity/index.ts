export function UpperEntity(name: string): ClassDecorator {
  return target => {
    Object.defineProperty(target, 'name', {
      enumerable: true,
      value: name,
    });
  };
}
