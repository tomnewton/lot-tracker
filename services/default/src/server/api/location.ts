import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
} from 'graphql';
import {connectionDefinitions, globalIdField} from 'graphql-relay';
import {getURLSafeKey} from '../db';
import {nodeInterface} from './node';

export const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: {
    id: globalIdField(
      'Location',
      (object: Location, context: any, info: GraphQLResolveInfo) => {
        return getURLSafeKey(object);
      },
    ),
    locationId: {
      type: GraphQLInt,
      resolve: (source, context, args) => {
        return source.locationId;
      },
    },
    currentLot: {
      type: GraphQLString,
      resolve: (source, context, args) => {
        return source.currentLot;
      },
    },
  },
  interfaces: [nodeInterface],
});

export const {connectionType: LocationConnection} = connectionDefinitions({
  nodeType: LocationType,
});
