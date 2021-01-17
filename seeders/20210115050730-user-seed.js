'use strict'

const users = require('../_data/users.json')
const userData = users.map(user => ({
  ...user,
  createdAt: new Date(),
  updatedAt: new Date()
}))

const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await User.bulkCreate(userData, {
      validate: true,
      individualHooks: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
