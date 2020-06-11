import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import {
  GraphQLDateTime,
} from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';

import GQLMiddleware from '../GQLMiddleware';

type Maybe<T> = T | null;

class ScalarMiddleware extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Resolver(): object {
    return {
      DateTime: GraphQLDateTime,
      JSONObject: GraphQLJSONObject,
      TrueOnly: new GraphQLScalarType({
        name: 'TrueOnly',
        serialize(value: boolean): Maybe<boolean> {
          return value || undefined;
        },
        parseValue(value: boolean): Maybe<boolean> {
          return value || undefined;
        },
        parseLiteral(valueNode: ValueNode): Maybe<boolean> {
          if (valueNode.kind === Kind.BOOLEAN && valueNode.value) {
            return valueNode.value;
          }
          return undefined;
        },
      }),
    };
  }
}

export default ScalarMiddleware;
