'use strict'

const { User, Group } = require('../models')

const groups = require('../_data/groups.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'publisher' } })
    const userIdPool = users.map(user => user.id)

    const groupData = groups.map((group, index) => ({
      ...group,
      UserId: userIdPool[index],
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    await Group.bulkCreate(groupData, {
      validate: true,
      individualHooks: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Groups', null, {})
  }
}
