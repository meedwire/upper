const typesSqlite = new Map([
  ['string', 'text'],
  ['number', 'int'],
  ['boolean', 'int'],
  ['uuid', 'text'],
  ['date', 'text'],
  ['relation', 'relation'],
]);

interface FieldInfo {
  type: string;
  primaryKey: boolean;
}

export function makeSqlFields(entity: new (...args: any[]) => any) {
  const fields = new entity();

  const mapFields: string[] = [];

  const makeSimpleRow = (field: string, info: FieldInfo) => {
    const nativeType = typesSqlite.get(info.type);

    const primaryKey = info.primaryKey ? ' PRIMARY KEY' : '';

    let row = `${field} ${nativeType}${primaryKey}`;

    return row;
  };

  const relationType = (field: string) => {
    const relation = Reflect.getMetadata('field:relation', fields, field);

    const entityToRelation = relation.entityFunc();
    const tableRelationToName = entityToRelation.name;
    const typeRelation = relation.type;
    const fieldRelation = relation.relationField;

    if (typeRelation === 'one-to-many') {
      return;
    }

    const instanceEntityToRelation = new entityToRelation();

    const parentInfo = Reflect.getMetadata(
      'field:type',
      instanceEntityToRelation,
      fieldRelation,
    );

    const fieldToRelation = `${field}_${fieldRelation}`;

    const row = `${fieldToRelation} ${typesSqlite.get(parentInfo.type)},
        FOREING KEY ${fieldToRelation} REFERENCES ${tableRelationToName}(${fieldRelation})`;

    return row;
  };

  Object.keys(fields).forEach(field => {
    const fieldInfo = Reflect.getMetadata('field:type', fields, field);

    const isRelation = fieldInfo.type === 'relation';

    if (isRelation) {
      const sqlRow = relationType(field);

      if (sqlRow) {
        mapFields.push(sqlRow);
      }
    } else {
      const sqlRow = makeSimpleRow(field, fieldInfo);

      if (sqlRow) {
        mapFields.push(sqlRow);
      }
    }
  });

  return mapFields;
}
