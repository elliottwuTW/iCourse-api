'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Orders', 'sn', {
      type: Sequelize.BIGINT
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Orders', 'sn', {
      type: Sequelize.INTEGER
    })
  }
}
