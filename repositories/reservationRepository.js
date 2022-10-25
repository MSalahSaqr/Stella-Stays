import db from "../models/index.js";
import { Op } from "sequelize";

export async function getOverlappingReservation(unitId, checkIn, checkOut) {
  const result = await db.Reservation.findAll({
    where: {
      [Op.and]: [
        {
          unit_id: unitId
        },
        {
          is_cancelled: false
        },
        {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  check_in: {
                    [Op.gte]: checkIn
                  }
                },
                {
                  check_in: {
                    [Op.lt]: checkOut
                  }
                }
              ]
            },
            {
              [Op.and]: [
                {
                  check_out: {
                    [Op.gt]: checkIn
                  }
                },
                {
                  check_out: {
                    [Op.lte]: checkOut
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    limit: 2,
    raw: true
  })

  return result
}

export async function getReservationById(reservationId) {
  const result = await db.Reservation.findOne({
    where: {
      [Op.and]: [
        {
          id: reservationId
        },
        {
          is_cancelled: false
        }
      ]
    },
    raw: true
  });

  return result;
}

export async function insertReservation(unitId, guestName, checkIn, checkOut) {
  const result = await db.Reservation.create({
    unit_id: unitId,
    guest_name: guestName,
    check_in: checkIn,
    check_out: checkOut
  });

  return result.get({ plain: true });
}

export async function updateReservationAndRemoveKey(reservationId, unitId, guestName, checkIn, checkOut) {
  const transaction = await db.sequelize.transaction();
  await db.Reservation.update({
    unit_id: unitId,
    guest_name: guestName,
    check_in: checkIn,
    check_out: checkOut
  }, { where: { id: reservationId } }, { transaction });

  await db.AccessCode.destroy({ where: { reservation_id: reservationId } }, { transaction });
  await transaction.commit();
}

export async function cancelReservationById(reservationId) {
  await db.Reservation.update({ is_canceled: true }, { where: { id: reservationId } });
}