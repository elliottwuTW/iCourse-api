'use strict'

const courses = require('../_data/courses.json')
const courseData = courses.map(course => ({
  ...course,
  createdAt: new Date(),
  updatedAt: new Date()
}))

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Courses', courseData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Courses', null, {})
  }
}
