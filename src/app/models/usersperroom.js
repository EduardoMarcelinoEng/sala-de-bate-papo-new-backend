'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersPerRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'nickname' });
      this.belongsTo(models.Room, { foreignKey: 'roomURL' });
    }
  }
  UsersPerRoom.init({
    nickname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roomURL: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isFavorite: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'UsersPerRoom',
  });
  return UsersPerRoom;
};