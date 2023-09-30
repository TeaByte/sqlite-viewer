export interface TableInfo {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: string | null;
  pk: boolean;
}

export type TableInfos = { [key: string]: TableInfo[] };
export type Columns = { [table: string]: { [key: string]: string[] } };
