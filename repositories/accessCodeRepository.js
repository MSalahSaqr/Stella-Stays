import db from "../models/index.js";

export async function createAccessCode(lockId, reservationId, passcode, remotePasscodeId) {
  return await db.AccessCode.create({
    lock_id: lockId,
    reservation_id: reservationId,
    passcode: passcode,
    remote_passcode_id: remotePasscodeId
  });
}

export async function getAccessCodeByReservationId(reservationId) {
  return await db.AccessCode.findOne({
    where: {
      reservation_id: reservationId
    },
    raw: true
  });
}
export async function deleteAccessCodeByReservationId(reservationId) {
  await db.AccessCode.destroy({ where: { reservation_id: reservationId } });
}