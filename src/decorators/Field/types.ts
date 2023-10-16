export interface FieldType {
  type: 'string' | 'number' | 'boolean' | 'date';
  defaultValue?: string | number | boolean | 'now';
}
