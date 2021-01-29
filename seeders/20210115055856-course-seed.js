'use strict'

const courses = require('../_data/courses.json')
const { Group, Course } = require('../models')

function randomInteger (num) {
  return Math.floor(Math.random() * num)
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const groups = await Group.findAll()
    const groupIdPool = groups.map(user => user.id)

    const courseData = courses.map(course => ({
      ...course,
      GroupId: randomInteger(groupIdPool.length),
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    await Course.bulkCreate(courseData, {
      validate: true,
      individualHooks: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Courses', null, {})
  }
}
