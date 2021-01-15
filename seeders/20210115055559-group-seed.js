'use strict'

const groups = require('../_data/groups.json')
const groupData = groups.map(group => ({
  ...group,
  createdAt: new Date(),
  updatedAt: new Date()
}))

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Groups', groupData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Groups', null, {})
  }
}
