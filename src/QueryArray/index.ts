import type { QuickSQLiteConnection } from 'react-native-quick-sqlite';
import type { Options } from './types';

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
    this.push(data);
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
