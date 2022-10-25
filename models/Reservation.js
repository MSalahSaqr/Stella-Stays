import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Reservation extends Model { }

  Reservation.init(
    {
      unit_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      guest_name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      check_in: {
        type: DataTypes.TIME,
        allowNull: false
      },
      check_out: {
        type: DataTypes.TIME,
        allowNull: false
      },
      is_cancelled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Reservation',
      tableName: 'reservation',
      timestamps: false
    }
  );
  return Reservation;
};