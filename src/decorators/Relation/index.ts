import type { TypeRelaction } from './types';

export const Relation: TypeRelaction = (entity, options) => {
  return (target, propertyKey) => {
    const fieldInfo = {
      type: 'relation',
      primaryKey: false,
    };

    Reflect.defineMetadata('field:type', fieldInfo, target, propertyKey);

    const relation = {
      type: options.type,
      relationField: options.reference,
      entityFunc: entity,
    };

    Reflect.defineMetadata('field:relation', relation, target, propertyKey);
  };
};
