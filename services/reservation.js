import { getReservationById, getOverlappingReservation, insertReservation, updateReservationAndRemoveKey, cancelReservationById } from "../repositories/reservationRepository.js";
import { getLockByUnitId } from "../repositories/lockRepository.js";
import { createAccessCode, deleteAccessCodeByReservationId, getAccessCodeByReservationId } from "../repositories/accessCodeRepository.js"
import { generateAccessCode, deleteAccessCode } from "../utilities/tuyaClient.js";

export async function createReservation(unitId, guestName, checkIn, checkOut) {
  checkIn = new Date(checkIn);
  checkOut = new Date(checkOut);
  if (!await isValidReservation(unitId, checkIn, checkOut))
    throw new Error("Not a Valid Reservation");

  const reservation = await insertReservation(unitId, guestName, checkIn, checkOut);
  generatePassCode(reservation.id, unitId);
  return {
    id: reservation.id,
    guestName: reservation.guest_name,
    unitId: reservation.unit_id,
    checkIn: new Date(reservation.check_in).toDateString(),
    checkOut: new Date(reservation.check_out).toDateString(),
  };
}

export async function updateReservation(reservationId, unitId, guestName, checkIn, checkOut) {
  checkIn = new Date(checkIn);
  checkOut = new Date(checkOut);
  if (!await isValidReservation(unitId, checkIn, checkOut, reservationId))
    throw new Error("Not a Valid Reservation");

  await updateReservationAndRemoveKey(reservationId, unitId, guestName, checkIn, checkOut);
  generatePassCode(reservationId, unitId);
  return {
    id: reservationId,
    guestName: guestName,
    unitId: unitId,
    checkIn: new Date(checkIn).toDateString(),
    checkOut: new Date(checkOut).toDateString(),
  };
}

export async function cancelReservation(reservationId) {
  await cancelReservationById(reservationId);
  deletePassCode(reservationId);
  return reservationId
}

//private functions
async function isValidReservation(unitId, checkIn, checkOut, reservationId = undefined) {
  let isValid = isDate(checkIn) &&
    isDate(checkOut) &&
    isOrderedRight(checkIn, checkOut) &&
    isUpcommingDate(checkIn, checkOut) &&
    await isDatesAvailable(unitId, checkIn, checkOut, reservationId);
  if (reservationId !== undefined)
    isValid = isValid && !await isReservationCanceled(reservationId);
  return isValid;
}

function isDate(date) {
  return (date !== "Invalid Date") && !isNaN(new Date(date));
}

function isOrderedRight(checkIn, checkOut) {
  return checkOut > checkIn
}

function isUpcommingDate(checkIn, checkOut) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return checkIn >= now && checkOut >= now
}

async function isReservationCanceled(reservationId) {
  const reservation = await getReservationById(reservationId);
  return reservation === null
}

async function isDatesAvailable(unitId, checkIn, checkOut, reservationId) {
  const result = await getOverlappingReservation(unitId, checkIn, checkOut);

  if (reservationId && result.length > 0 && result.length < 2 && result[0].id === reservationId)
    return true
  if (result.length === 0)
    return true

  return false
}

async function generatePassCode(reservationId, unitId) {
  const lock = await getLockByUnitId(unitId);
  if (lock === null)
    return
  let codeObj = undefined;

  for (let i = 0; i < 3; i++) {
    try {
      codeObj = generateAccessCode(lock.remote_lock_id);
    } catch (error) {
      if (i == 2)
        console.log(`[generateAccessCode] something went wrong, all retries faild!!`);
      else
        console.log(`[generateAccessCode] something went wrong, retry No: ${i + 1}!!`);
    }
  }

  if (codeObj === undefined)
    return
  await createAccessCode(lock.id, reservationId, codeObj.accessCode, codeObj.accessCodeId);
}

async function deletePassCode(reservationId) {
  const accessCode = await getAccessCodeByReservationId(reservationId);
  if (accessCode === null)
    return;
  let deletedFromTuya = false;
  for (let i = 0; i < 3; i++) {
    try {
      deleteAccessCode(accessCode.remote_passcode_id);
      deletedFromTuya = true
    } catch (error) {
      if (i == 2)
        console.log(`[generateAccessCode] something went wrong, all retries faild!!`);
      else
        console.log(`[generateAccessCode] something went wrong, retry No: ${i + 1}!!`);
    }
  }
  if (deletedFromTuya)
    await deleteAccessCodeByReservationId(reservationId);
}
