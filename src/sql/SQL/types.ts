export interface GetOneParams {
  query: {
    name: string;
    fields?: Record<string, boolean>;
    where?: {[field: string]: string};
  };
  values?: any[];
}

export interface HasParams {
  name: string;
  criteria?: {where?: {[field: string]: string}; values?: any[]};
}

export interface InsertOrUpdateParmas {
  query: any;
  prop: string;
  value: any;
}

export interface SQLSelectParams {
  tableName: string;
  columns: string;
  where?: string;
}

export interface SQLWhere {
  [field: string]: string;
}
