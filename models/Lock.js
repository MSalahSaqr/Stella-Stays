import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Lock extends Model { }

  Lock.init(
    {
      unit_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      remote_lock_id: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Lock',
      tableName: 'lock',
      timestamps: false
    }
  );
  return Lock;
};