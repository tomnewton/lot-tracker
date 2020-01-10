type ArgsCursor = {cursor?: string};
type ArgsWithId = {id?: string};

export type CollectionResolver<T, A> = (
  parent: any,
  args: ArgsCursor,
  context: {dataSources: {api: A}},
  info: any,
) => Promise<T[]>;

export type EntityResolver<T, A> = (
  parent: any,
  args: ArgsWithId,
  context: {dataSources: {api: A}},
  info: any,
) => Promise<T>;

export type BasicResolver<T, A, G> = (
  parent: any,
  args: G,
  context: {dataSources: {api: A}},
  info: any,
) => Promise<T>;
