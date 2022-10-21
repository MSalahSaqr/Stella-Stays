import express from 'express';
import { graphqlHTTP } from 'express-graphql'
import { schema } from './graphql/schema.js';
import { root } from './graphql/providers.js'

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');