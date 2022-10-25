import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import * as dotenv from 'dotenv';
import { schema } from './graphql/schema.js';
import { root } from './graphql/providers.js';
import db from './models/index.js';

dotenv.config({ path: "./.env" })

await db.sequelize.authenticate()
  .then(() => {
    console.log("Connection to database successfull");
  })
  .catch(err => {
    console.log("Unable to connect to the database", err);
    process.exit()
  });

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');