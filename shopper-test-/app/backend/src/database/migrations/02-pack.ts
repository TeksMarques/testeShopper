"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("packs", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          pack_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: { model: "products", key: "code" },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          product_id: {
            type: Sequelize.NUMBER,
            allowNull: false,
            references: { model: "products", key: "code" },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          qty: {
            type: Sequelize.NUMBER,
            allowNull: false,
          },  
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("packs");
  },
};