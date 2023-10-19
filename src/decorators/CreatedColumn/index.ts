import 'reflect-metadata';
import type { FieldInfo } from '../../commonTypes';

export function CreatedColumn(): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const fieldInfo = {
      type: 'date',
      primaryKey: false,
      nullable: false,
    } as const;

    Reflect.defineMetadata<FieldInfo>(
      'field:type',
      fieldInfo,
      target,
      propertyKey
    );

    let val: any = new Date();

    Object.defineProperty(target, propertyKey.toString(), {
      enumerable: true,
      configurable: true,
      get() {
        return val;
      },
      set(newValue: any) {
        val = newValue;
      },
    });

    const descripptor = Object.getOwnPropertyDescriptor(target, propertyKey);

    return {
      ...descripptor,
      initializer: () => {
        return new Date();
      },
    };
  };
}
