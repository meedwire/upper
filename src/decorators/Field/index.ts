import 'reflect-metadata';
import type { FieldType } from './types';

export function Field(params: FieldType): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const fieldInfo = {
      type: params.type,
      primaryKey: false,
    };

    Reflect.defineMetadata('field:type', fieldInfo, target, propertyKey);

    let val: any = '';

    if (params.defaultValue !== undefined) {
      const defaultType = params.defaultValue;

      if (defaultType === 'now') {
        val = new Date();
      }

      val = params.defaultValue;
    }

    return {
      enumerable: true,
      configurable: true,
      initializer: () => {
        return val;
      },
      get() {
        return val;
      },
      set(newValue: any) {
        val = newValue;
      },
    };
  };
}
