import type { FieldInfo } from '../../commonTypes';

const typesSqlite = new Map([
  ['string', 'text'],
  ['number', 'int'],
  ['boolean', 'int'],
  ['uuid', 'text'],
  ['date', 'text'],
  ['relation', 'relation'],
]);

const fieldInfo = (target: any, field: string) => {
  return Reflect.getMetadata<FieldInfo>('field:type', target, field);
};

const order = (a: FieldInfo, b: FieldInfo) => {
  if (a.type === 'relation' && b.type !== 'relation') {
    return 1;
  }
  if (a.type !== 'relation' && b.type === 'relation') {
    return -1;
  }
  return 0;
};

export function makeSqlFields(entity: new (...args: any[]) => any) {
  const fields = new entity();

  const mapFields: string[] = [];

  const makeSimpleRow = (field: string, info: FieldInfo) => {
    const nativeType = typesSqlite.get(info.type);

    const extra = info.primaryKey ? ' PRIMARY KEY' : '';

    const nullable = info.nullable ? '' : ' NOT NULL';

    let row = `${field} ${nativeType}${extra}${nullable}`;

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
      fieldRelation
    );

    const fieldToRelation = `${field}_${fieldRelation}`;

    const row = `${fieldToRelation} ${typesSqlite.get(parentInfo.type)},
      FOREIGN KEY(${fieldToRelation}) REFERENCES ${tableRelationToName}(${fieldRelation})`;

    return row;
  };

  const fieldsByConfig = Object.keys(fields)
    .map((field) => {
      const metadata = fieldInfo(fields, field);

      return {
        field,
        ...metadata,
      };
    })
    .sort(order);

  fieldsByConfig.forEach((config) => {
    const isRelation = config.type === 'relation';

    if (isRelation) {
      const sqlRow = relationType(config.field);

      if (sqlRow) {
        mapFields.push(sqlRow);
      }
    } else {
      const sqlRow = makeSimpleRow(config.field, config);

      if (sqlRow) {
        mapFields.push(sqlRow);
      }
    }
  });

  return mapFields;
}
