import type { QuickSQLiteConnection } from 'react-native-quick-sqlite';
import type { Options } from './types';

function parseValue(value: any) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Boolean) {
    return Number(value);
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return value;
}

function filterKey(data: any) {
  return (k: string) => {
    if (data[k] !== undefined && data[k]?.length !== 0) {
      return true;
    }
    return false;
  };
}

function filter(v: any) {
  return v !== undefined && v?.length !== 0;
}

export class QueryArray<T> extends Array<T> {
  private tableName: string | null;
  private db: QuickSQLiteConnection | null;
  private schema: any;

  constructor({ tableName, db }: Options, initialValues?: T[]) {
    super();
    this.tableName = tableName;
    this.db = db;

    Array.prototype.push.apply(this, initialValues ?? []);
  }

  insert(data: T) {
    const fields = Object.keys(data as object)
      .filter(filterKey(data))
      .join(',');
    const values = Object.values(data as object)
      .filter(filter)
      .map((value) => parseValue(value))
      .join(',');

    const sql = `INSERT INTO ${this.tableName} (${fields}) values (${values})`;

    if (!this.db) {
      throw new Error('DB is not defined');
    }

    this.push(data);

    this.db.execute(sql);
    return true;
  }

  deleteByIndex(index: number) {
    const item = this.at(index) as any;

    if (!item) {
      throw new Error('Item index not found');
    }

    const id = item.id;

    const sql = `DELETE FROM ${this.tableName} WHERE id = $1`;

    if (!this.db) {
      throw new Error('DB is not defined');
    }

    this.splice(index, 1);

    this.db.execute(sql, [id]);
  }

  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): QueryArray<U> {
    const modifiedCallbackfn = (value: T, index: number, array: T[]) => {
      const result = callbackfn(value, index, array);

      return result;
    };

    const resultArray = super.map(modifiedCallbackfn, thisArg);
    const resultQueryArray = new QueryArray<U>(
      { tableName: this.tableName!, db: this.db! },
      resultArray
    );
    return resultQueryArray;
  }

  create() {
    return new this.schema();
  }
}
