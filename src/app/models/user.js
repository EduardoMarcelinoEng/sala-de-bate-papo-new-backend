'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.UsersPerRoom, { foreignKey: 'nickname' });
      this.hasMany(models.Message, { foreignKey: 'nickname' });
    }
  }
  User.init({
    nickname: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};