'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UsersPerRooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nickname: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {model: 'Users', key: 'nickname'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      roomURL: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {model: 'Rooms', key: 'url'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      isFavorite: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UsersPerRooms');
  }
};