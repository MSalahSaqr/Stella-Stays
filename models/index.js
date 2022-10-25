import Sequelize from 'sequelize';
import Unit from './Unit.js';
import Reservation from './Reservation.js';
import Lock from './Lock.js';
import AccessCode from './AccessCode.js';

const sequelize = new Sequelize('://postgres:6556@localhost:5432/StellaStayTask');

const unit = Unit(sequelize);
const reservation = Reservation(sequelize);
const lock = Lock(sequelize);
const accessCode = AccessCode(sequelize);

unit.hasMany(reservation, {
  foreignKey: 'unit_id'
});
reservation.belongsTo(unit, {
  foreignKey: 'unit_id'
});

unit.hasOne(lock, {
  foreignKey: "unit_id"
})
lock.belongsTo(unit, {
  foreignKey: 'unit_id'
});

reservation.hasOne(accessCode, {
  foreignKey: "reservation_id"
})
accessCode.belongsTo(reservation, {
  foreignKey: "reservation_id"
})

lock.hasMany(accessCode, {
  foreignKey: "lock_id"
})
accessCode.belongsTo(lock, {
  foreignKey: "lock_id"
})

const db = {
  Unit: unit,
  Reservation: reservation,
  AccessCode: accessCode,
  Lock: lock,
  sequelize: sequelize,
  Sequelize: Sequelize
};


export default db;
