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
    averageRating: {
      type: DataTypes.FLOAT
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

  // Course hooks
  Course.afterSave(async (course) => {
    await course.updateAverageCost()
  })
  Course.beforeDestroy(async (course) => {
    await course.updateAverageCost()
  })

  return Course
}
