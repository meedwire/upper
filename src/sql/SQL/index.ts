import type { QuickSQLiteConnection } from 'react-native-quick-sqlite';
import type {
  GetOneParams,
  HasParams,
  InsertOrUpdateParmas,
  SQLSelectParams,
  SQLWhere,
  SqlInsertOrUpdate,
} from './types';
import { QueryArray } from '../../QueryArray';
import { parseValue } from '../../helpers';

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

  InsertOrUpdate(params: InsertOrUpdateParmas) {
    const tableName = params.table;
    const field = params.prop;
    const id = params.id;
    const value = parseValue(params.value);

    const query = this.sqlInsertOrUpdate({
      name: tableName,
      prop: field,
      id,
      value,
    });

    return this.db.execute(query);
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

  private sqlInsertOrUpdate(query: SqlInsertOrUpdate) {
    const tableName = query.name;
    const field = query.prop.toString();
    const value = query.value;
    const id = query.id;

    const sql = `
      INSERT INTO ${tableName} (id, ${field})
      VALUES ('${id}', ${value})
      ON CONFLICT(id) DO UPDATE SET ${field} = ${value};
    `;

    return sql;
  }
}
