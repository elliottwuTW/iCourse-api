'use strict'
const {
  Model,
  Op
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

  // get average rating
  async function getAvgRating (model, column, condition) {
    const score = await model.findAll({
      attributes: [
        [sequelize.fn('avg', sequelize.col(column)), 'avg_rating']
      ],
      where: condition,
      raw: true
    })
    // precision to 2 decimal places
    return Math.round(score[0].avg_rating * 100) / 100
  }

  // update the averageRating of Group
  Review.prototype.updateAverageRating = async function (courseId) {
    try {
      const Course = sequelize.models.Course
      const Group = sequelize.models.Group

      // update course averageRating
      const courseAvgRating = await getAvgRating(Review, 'rating', { CourseId: courseId })
      const course = await Course.findByPk(courseId)
      await course.update({ averageRating: courseAvgRating })

      // update group averageRating
      const groupAvgRating = await getAvgRating(Course, 'averageRating', {
        GroupId: course.GroupId,
        averageRating: { [Op.ne]: null }
      })
      await Group.update({ averageRating: groupAvgRating }, { where: { id: course.GroupId } })
    } catch (err) {
      console.error(err)
    }
  }

  // Review hooks
  Review.afterSave(async (review) => {
    await review.updateAverageRating(review.CourseId)
  })
  Review.beforeDestroy(async (review) => {
    await review.updateAverageRating(review.CourseId)
  })

  return Review
}
