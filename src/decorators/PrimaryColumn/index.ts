import { generateUUID } from '../../helpers';
import type { PrimaryDecorator } from './types';

export const PrimaryColumn: PrimaryDecorator = (params) => {
  return (target, propertyKey) => {
    const fieldInfo = {
      type: params.type,
      primaryKey: true,
    };

    Reflect.defineMetadata('field:type', fieldInfo, target, propertyKey);

    return {
      enumerable: true,
      configurable: true,
      initializer: () => {
        return generateUUID();
      },
      set: function () {},
      get: function () {
        return generateUUID();
      },
    };
  };
};
