export interface FieldTypesPrimary {
  type: 'string' | 'number' | 'boolean' | 'uuid';
}

export type PrimaryDecorator = (params: FieldTypesPrimary) => PropertyDecorator;
