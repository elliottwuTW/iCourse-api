'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Users', 'resetPasswordToken',
          { type: Sequelize.STRING },
          { transaction: t }
        ),
        queryInterface.addColumn('Users', 'resetPasswordExpire',
          { type: Sequelize.DATE },
          { transaction: t }
        )
      ])
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Users', 'resetPasswordToken', { transaction: t }),
        queryInterface.removeColumn('Users', 'resetPasswordExpire', { transaction: t })
      ])
    })
  }
}
