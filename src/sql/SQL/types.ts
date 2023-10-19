export interface GetOneParams {
  query: {
    name: string;
    fields?: Record<string, boolean>;
    where?: { [field: string]: string };
  };
  values?: any[];
}

export interface HasParams {
  name: string;
  criteria?: { where?: { [field: string]: string }; values?: any[] };
}

export interface InsertOrUpdateParmas {
  table: string;
  prop: string | symbol;
  value: any;
  id: string;
}

export interface SQLSelectParams {
  tableName: string;
  columns: string;
  where?: string;
}

export interface SQLWhere {
  [field: string]: string;
}

export interface SqlInsertOrUpdate {
  name: string;
  prop: string | symbol;
  value: string;
  id: string;
}
