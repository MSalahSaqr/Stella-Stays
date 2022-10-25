import db from "../models/index.js";

export async function getLockByUnitId(unitId) {
  return await db.Lock.findOne({
    where: {
      unit_id: unitId
    },
    raw: true
  })
}