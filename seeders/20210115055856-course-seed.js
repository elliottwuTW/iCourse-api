'use strict'

const courses = require('../_data/courses.json')
const courseData = courses.map(course => ({
  ...course,
  createdAt: new Date(),
  updatedAt: new Date()
}))

const { Course } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Course.bulkCreate(courseData, {
      validate: true,
      individualHooks: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Courses', null, {})
  }
}
