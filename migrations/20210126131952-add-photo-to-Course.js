'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Courses', 'photo', {
      type: Sequelize.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Courses', 'photo')
  }
}
