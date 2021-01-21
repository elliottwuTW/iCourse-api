'use strict'
const {
  Model
} = require('sequelize')
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
      Course.hasMany(models.Review)
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

  // get the average cost of Group
  Course.prototype.getAverageCost = async function (groupId) {
    const tuition = await Course.findAll({
      attributes: [
        [sequelize.fn('avg', sequelize.col('tuition')), 'avg_cost']
      ],
      where: { GroupId: groupId },
      raw: true
    })
    // update to the Group with groupId
    const averageCost = Math.round(tuition[0].avg_cost)
    await sequelize.models.Group.update({ averageCost }, { where: { id: groupId } })
  }

  // update the averageCost of Group
  Course.afterSave(course => {
    course.getAverageCost(course.GroupId)
  })
  Course.beforeDestroy(course => {
    course.getAverageCost(course.GroupId)
  })

  return Course
}
