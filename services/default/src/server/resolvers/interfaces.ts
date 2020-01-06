export type CollectionResolver<T, A> = (
  parent: any,
  args: {cursor?: string},
  context: {dataSources: {api: A}},
  info: any,
) => Promise<T[]>;

export type EntityResolver<T, A> = (
  parent: any,
  args: {id?: string},
  context: {dataSources: {api: A}},
  info: any,
) => Promise<T>;
