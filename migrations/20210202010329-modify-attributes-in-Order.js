'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Orders', 'phone', { transaction: t }),
        queryInterface.removeColumn('Orders', 'address', { transaction: t }),
        queryInterface.addColumn('Orders', 'email',
          { allowNull: false, type: Sequelize.STRING },
          { transaction: t }
        )
      ])
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Orders', 'phone',
          { type: Sequelize.STRING },
          { transaction: t }
        ),
        queryInterface.addColumn('Orders', 'address',
          { type: Sequelize.DATE },
          { transaction: t }
        ),
        queryInterface.removeColumn('Orders', 'email', { transaction: t })
      ])
    })
  }
}
