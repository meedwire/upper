type FieldsSql = string[];

export function makeSqlTable(entityName: string, fields: FieldsSql) {
  const mapperFielsSqlite = (rows: string[]) => {
    const sqlRows = rows.map(row => `\t${row}`);

    return sqlRows.join(',\n');
  };

  const sql = `
    CREATE TABLE IF NOT EXISTS ${entityName} (
      ${mapperFielsSqlite(fields)}
    );
    `;

  return sql;
}
