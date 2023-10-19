import { type QuickSQLiteConnection, open } from 'react-native-quick-sqlite';
import type { DatabaseSelectOptions, Entities, UpperOptions } from './types';
import { makeSqlFields } from '../sql/makeSqlFields';
import { makeSqlTable } from '../sql/makeSqlTable';
import { SQL } from '../sql/SQL';

export class Database<T extends Entities> {
  private db: QuickSQLiteConnection | null = null;
  private databaseName: string | null = null;
  private entities: Entities | null = null;
  private sql: SQL;

  constructor(options: UpperOptions<T>) {
    this.databaseName = options.name;
    this.entities = options.entities;

    this.createConnection();
    this.prepare();

    this.sql = new SQL(this.db!);
  }

  private prepare() {
    if (!this.entities) {
      throw new Error('Failed prepare db, entities not defined');
    }

    const query = Object.values(this.entities).map((instance) => {
      const fieldsSql = makeSqlFields(instance);
      const tableSql = makeSqlTable(instance.name, fieldsSql);

      return tableSql;
    });

    this.db!.executeBatch(query.map((q) => [q]));
  }

  private createConnection() {
    if (!this.databaseName) {
      throw new Error('Failed create connection db, name not defined');
    }

    const db = open({ name: this.databaseName });
    this.db = db;
  }

  select<T>(entityName: string, options?: T) {
    if (!this.entities) {
      throw new Error('Error in select, entities is not defined');
    }

    const selectOptions = options as DatabaseSelectOptions;

    const entity = this.entities[entityName];

    if (!entity) {
      throw new Error('Entity not defined');
    }

    const tableName = entity.name;

    return this.sql.Get({
      query: {
        name: tableName,
        fields: selectOptions?.select,
        where: selectOptions?.where,
      },
    });
  }

  selectOne<T>(entityName: string, options?: T) {
    if (!this.entities) {
      throw new Error('Error in select, entities is not defined');
    }

    const selectOptions = options as DatabaseSelectOptions;

    const entity = this.entities[entityName];

    if (!entity) {
      throw new Error('Entity not defined');
    }

    const tableName = entity.name;

    const result = this.sql.GetOne({
      query: {
        name: tableName,
        fields: selectOptions?.select,
        where: selectOptions?.where,
      },
    });

    return result ? result : new entity();
  }

  insertOrUpdate(
    entityName: string,
    target: any,
    prop: string | symbol,
    value: any
  ) {
    if (!this.entities) {
      throw new Error('Error in select, entities is not defined');
    }

    const entity = this.entities[entityName];

    if (!entity) {
      throw new Error('Entity not defined');
    }

    const tableName = entity.name;
    const id = target.id;

    this.sql.InsertOrUpdate({ table: tableName, id, prop, value });
  }
}
