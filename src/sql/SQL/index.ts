import type { QuickSQLiteConnection } from 'react-native-quick-sqlite';
import type {
  GetOneParams,
  HasParams,
  SQLSelectParams,
  SQLWhere,
} from './types';
import { QueryArray } from '../../QueryArray';

export class SQL {
  private db: QuickSQLiteConnection;

  constructor(db: QuickSQLiteConnection) {
    this.db = db;
  }

  Get(params: GetOneParams) {
    const queryFields = params?.query?.fields;
    const tableName = params.query.name;
    const columns = queryFields ? Object.keys(queryFields).join(', ') : '*';
    const values = params?.values;

    const where = this.sqlCreateCriteria(params.query?.where);

    const sql = this.sqlSelect({
      tableName,
      columns,
      where,
    });

    const { rows } = this.db.execute(sql, values);

    const result =
      rows?.length && rows.length > 0
        ? new QueryArray({ tableName, db: this.db }, rows._array)
        : new QueryArray({ tableName, db: this.db });

    return result;
  }

  GetOne(params: GetOneParams) {
    const queryFields = params?.query?.fields;
    const tableName = params.query.name;
    const columns = queryFields ? Object.keys(queryFields).join(', ') : '*';
    const values = params?.values;

    const where = this.sqlCreateCriteria(params.query?.where);

    const sql = this.sqlSelect({
      tableName,
      columns,
      where,
    });

    const { rows } = this.db.execute(sql, values);

    return rows?.item(0);
  }

  HasData(params: HasParams) {
    const whereColumns = Object.keys(params.criteria!.where!);
    const wherePlaceholders = whereColumns
      .map((col) => `${col} ${params.criteria!.where![col]}`)
      .join(' AND ');
    const selectSql = `
      SELECT COUNT(*) as count
      FROM ${params.name}
      WHERE ${wherePlaceholders};
  `;
    const result = this.db.execute(selectSql, params.criteria?.values);
    return !!result.rows;
  }

  private sqlSelect(params: SQLSelectParams) {
    const where = `${params.where ? '\n\t' + params.where + ';' : ';'}`;

    return `SELECT ${params.columns}
            FROM ${params.tableName}${where}
            `;
  }

  private sqlCreateCriteria(where?: SQLWhere) {
    if (!where) {
      return undefined;
    }

    const whereParts = Object.entries(where).map(
      ([key, value]) => `${key} ${value}`
    );

    if (whereParts.length === 0) {
      return undefined;
    }

    return `WHERE ${whereParts.join(' AND ')}`;
  }

  // private sqlInsertOrUpdate(query) {
  //   const tableName = query.name;
  //   const field = query.prop;
  //   const value = query.value;

  //   const sql = `
  //     BEGIN TRANSACTION;

  //     UPDATE ${tableName} SET ${field} = ${value} WHERE demo.ID = 102;

  //     INSERT INTO demo (ID, Name, Hint)
  //     VALUES (102, 'Leonardo', 'A real human')
  //     ON CONFLICT(ID) DO NOTHING;

  //     COMMIT TRANSACTION;
  //   `;
  // }
}
