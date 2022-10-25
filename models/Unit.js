import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Unit extends Model { }

  Unit.init(
    {
      unit_name: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Unit',
      tableName: 'unit',
      timestamps: false
    }
  );
  return Unit;
};