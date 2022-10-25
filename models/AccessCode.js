import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class AccessCode extends Model { }

  AccessCode.init(
    {
      lock_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      reservation_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      passcode: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      remote_passcode_id: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'AccessCode',
      tableName: 'access_code',
      timestamps: false
    }
  );
  return AccessCode;
};