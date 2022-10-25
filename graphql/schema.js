import { buildSchema } from "graphql";

// Construct a schema, using GraphQL schema language
export const schema = buildSchema(`
type Reservation {
  id: ID
  guestName: String
  checkIn: String
  checkOut: String
}

type Query {
    hello: String
  }

type Mutation {
  createReservation(unitID: ID!, guestName: String!, checkIn: String!, checkOut: String!): Reservation
  updateReservation(reservationID: ID!, unitID: ID!, guestName: String!, checkIn: String!, checkOut: String!): Reservation
  cancelReservation(reservationID: ID!): ID
}
`);
