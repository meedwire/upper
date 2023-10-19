import { generateUUID } from '../../helpers';
import type { PrimaryDecorator } from './types';

export const PrimaryColumn: PrimaryDecorator = (params) => {
  return (target, propertyKey) => {
    const fieldInfo = {
      type: params.type,
      primaryKey: true,
      nullable: false,
    };

    Reflect.defineMetadata('field:type', fieldInfo, target, propertyKey);

    Object.defineProperty(target, propertyKey.toString(), {
      enumerable: true,
      configurable: true,
      set: function () {},
      get: function () {
        return generateUUID();
      },
    });

    const descripptor = Object.getOwnPropertyDescriptor(target, propertyKey);

    return {
      ...descripptor,
      initializer: () => {
        return generateUUID();
      },
    };
  };
};

// return {
//   enumerable: true,
//   configurable: true,
//   initializer: () => {
//     return generateUUID();
//   },
//   set: function () {},
//   get: function () {
//     return generateUUID();
//   },
// };
