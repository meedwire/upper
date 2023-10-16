import { Database } from '../Database';
import { QueryArray } from '../QueryArray';
import { upper } from '../register/upper';
import type {
  Entities,
  FieldsSelect,
  QueryOptions,
  QueryResult,
  UpperOptions,
} from './types';

export class Upper<T extends Entities> extends Database<T> {
  constructor(options: UpperOptions<T>) {
    super(options);
  }

  Query<Entity extends keyof T, Fields extends FieldsSelect<T[Entity]>>(
    entityName: Entity,
    options?: QueryOptions<T[Entity], Fields>
  ): QueryArray<QueryResult<T[Entity], Fields>> {
    const rows = this.select(entityName as string, options);
    const upperRows = rows.map((row) => upper(row));

    return upper(upperRows) as any;
  }

  QueryOne<Entity extends keyof T, Fields extends FieldsSelect<T[Entity]>>(
    entityName: Entity,
    options?: QueryOptions<T[Entity], Fields>
  ): InstanceType<T[Entity]> {
    const row = this.selectOne(entityName as string, options);

    return upper(row);
  }
}
