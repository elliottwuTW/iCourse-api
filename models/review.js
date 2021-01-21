'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Review.belongsTo(models.User)
      Review.belongsTo(models.Course)
    }
  }
  Review.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    text: DataTypes.STRING,
    rating: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    CourseId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      reference: {
        model: 'Courses',
        key: 'id'
      }
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      reference: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Review'
  })
  return Review
}
