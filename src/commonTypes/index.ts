export interface FieldInfo {
  type: 'string' | 'number' | 'boolean' | 'date' | 'relation';
  primaryKey: boolean;
  nullable: boolean;
}
