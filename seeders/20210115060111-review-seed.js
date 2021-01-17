'use strict'

const { User, Course, Review } = require('../models')

function randomInteger (num) {
  return Math.floor(Math.random() * num)
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } })
    const courses = await Course.findAll()
    const userIdPool = users.map(user => user.id)
    const courseIdPool = courses.map(course => course.id)

    const reviewData = Array.from({ length: 20 }).map((_, index) => ({
      title: `review title ${index + 1}`,
      text: `review text ${index + 1} ...`,
      rating: randomInteger(10) + 1,
      CourseId: courseIdPool[randomInteger(courseIdPool.length)],
      UserId: userIdPool[randomInteger(userIdPool.length)],
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    await Review.bulkCreate(reviewData, {
      validate: true,
      individualHooks: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reviews', null, {})
  }
}
