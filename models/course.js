'use strict'
const {
  Model
} = require('sequelize')
const sendEmail = require('../utils/sendEmail')
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Course.belongsTo(models.Group)
      Course.hasMany(models.Review, { onDelete: 'CASCADE', hooks: true })
      Course.belongsToMany(models.User, {
        through: models.Enrollment,
        foreignKey: 'CourseId',
        as: 'participants'
      })
    }
  }
  Course.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING(250)
    },
    hours: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    tuition: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    averageRating: {
      type: DataTypes.FLOAT
    },
    photo: {
      type: DataTypes.STRING
    },
    GroupId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      reference: {
        model: 'Groups',
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
    modelName: 'Course'
  })

  // update the averageCost of Group
  Course.prototype.updateAverageCost = async function () {
    try {
      // get the average cost
      const tuition = await Course.findAll({
        attributes: [
          [sequelize.fn('avg', sequelize.col('tuition')), 'avg_cost']
        ],
        where: { GroupId: this.GroupId },
        raw: true
      })
      const averageCost = Math.round(tuition[0].avg_cost)

      // update
      await sequelize.models.Group.update({ averageCost }, { where: { id: this.GroupId } })
    } catch (err) {
      console.error(err)
    }
  }

  // send email to notify all followers
  Course.prototype.notifyAllFollowers = async function () {
    const course = this
    const group = await sequelize.models.Group.findByPk(this.GroupId, {
      include: { model: sequelize.models.User, as: 'followers', attributes: ['email'] }
    })
    await Promise.all(
      group.followers.map(follower => sendEmail({
        email: follower.email,
        subject: `[iCourse] ${group.name} has published a new course`,
        html: `
          <h3>New Course ${course.name} Published!</h3>
          Check it out in i-Course. Have a GOOD learning journey!
        `
      }))
    )
  }

  // Course hooks
  Course.afterSave(async (course) => {
    await course.updateAverageCost()
  })
  Course.afterDestroy(async (course) => {
    await course.updateAverageCost()
  })
  Course.afterCreate(async (course) => {
    await course.notifyAllFollowers()
  })

  return Course
}
