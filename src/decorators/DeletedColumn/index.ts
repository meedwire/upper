import 'reflect-metadata';
import type { FieldInfo } from '../../commonTypes';

export function DeletedColumn(): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const fieldInfo = {
      type: 'date',
      primaryKey: false,
      nullable: true,
    } as const;

    Reflect.defineMetadata<FieldInfo>(
      'field:type',
      fieldInfo,
      target,
      propertyKey
    );

    let val: any = null;

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
        return null;
      },
    };
  };
}
