"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("products", {
        code: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          cost_price: {
            type: Sequelize.NUMBER,
            allowNull: false,
          },
          sales_price: {
            type: Sequelize.NUMBER,
            allowNull: false,
          },  
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("products");
  },
};
