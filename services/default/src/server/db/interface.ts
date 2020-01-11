export interface IDatasourceAPI<T> {
  create(input: any): Promise<T>;
  get(id: string): Promise<T>;
  list(cursor: string, limit: number): Promise<T[]>;
  delete(id: string): Promise<void>;
}
