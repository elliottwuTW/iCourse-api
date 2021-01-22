'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Courses', 'averageRating', {
      type: Sequelize.FLOAT
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Courses', 'averageRating')
  }
}
