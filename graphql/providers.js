import { cancelReservation, createReservation, updateReservation } from "../services/reservation.js";

// The root provides a resolver function for each API endpoint
export const root = {

  hello: () => {
    return 'Hello world!';
  },
  createReservation: async ({ unitID, guestName, checkIn, checkOut }) => {
    return await createReservation(unitID, guestName, checkIn, checkOut);
  },
  updateReservation: async ({ reservationID, unitID, guestName, checkIn, checkOut }) => {
    return await updateReservation(reservationID, unitID, guestName, checkIn, checkOut);
  },
  cancelReservation: async ({ reservationID }) => {
    await cancelReservation(reservationID);
  },
};
