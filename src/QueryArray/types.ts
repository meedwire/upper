import type { QuickSQLiteConnection } from 'react-native-quick-sqlite';

export interface Options {
  tableName: string;
  db: QuickSQLiteConnection;
}
