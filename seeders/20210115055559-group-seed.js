'use strict'

const groups = require('../_data/groups.json')
const groupData = groups.map(group => ({
  ...group,
  createdAt: new Date(),
  updatedAt: new Date()
}))

const { Group } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Group.bulkCreate(groupData, {
      validate: true,
      individualHooks: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Groups', null, {})
  }
}
