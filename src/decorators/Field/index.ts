import type { FieldType } from './types';
import type { FieldInfo } from '../../commonTypes';

export function Field(params: FieldType): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const fieldInfo = {
      type: params.type,
      primaryKey: false,
      nullable: params.nullable ?? false,
    };

    Reflect.defineMetadata<FieldInfo>(
      'field:type',
      fieldInfo,
      target,
      propertyKey
    );

    let val: any;

    if (params.defaultValue !== undefined) {
      const defaultType = params.defaultValue;

      if (defaultType === 'now') {
        val = new Date();
      } else {
        val = params.defaultValue;
      }
    }

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
  };
}
