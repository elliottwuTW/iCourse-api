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

  // update the averageRating of Group
  Review.prototype.updateAverageRating = async function (courseId) {
    // get the course average rating
    const score = await Review.findAll({
      attributes: [
        [sequelize.fn('avg', sequelize.col('rating')), 'avg_rating']
      ],
      where: { CourseId: courseId },
      raw: true
    })
    const courseAvgRating = score[0].avg_rating

    // update to course
    const Course = sequelize.models.Course
    const course = await Course.findByPk(courseId)
    await course.update({ averageRating: courseAvgRating })

    // get the group average rating
    const groupScore = await Course.findAll({
      attributes: [
        [sequelize.fn('avg', sequelize.col('averageRating')), 'avg_rating']
      ],
      where: {
        GroupId: course.GroupId,
        averageRating: { [Op.ne]: null }
      },
      raw: true
    })
    const groupAvgRating = groupScore[0].avg_rating

    // update to group
    const Group = sequelize.models.Group
    await Group.update({ averageRating: groupAvgRating }, { where: { id: course.GroupId } })
  }

  // Review hooks
  Review.afterSave(review => {
    review.updateAverageRating(review.CourseId)
  })
  Review.beforeDestroy(review => {
    review.updateAverageRating(review.CourseId)
  })

  return Review
}
