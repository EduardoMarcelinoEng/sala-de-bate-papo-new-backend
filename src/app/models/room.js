'use strict';
const {
  Model
} = require('sequelize');
const { resolve } = require("path");
const utils = require(resolve("src", "utils"));

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.UsersPerRoom, { foreignKey: 'roomURL' });
      this.hasMany(models.Message, { foreignKey: 'roomURL' });
    }
  }
  Room.init({
    url: {
      primaryKey: true,
      type: DataTypes.STRING,
      validate: {
        is: /^(\/([a-z0-9\-])*)*$/,
        not: /\-\//,
        not: /\/\-/,
        not: /\/\//,
        not: /\-\-/
      }
    }
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};