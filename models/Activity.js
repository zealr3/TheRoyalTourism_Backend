module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define('Activity', {
      aid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      adetail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      aactivity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      aimg: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      best_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      did: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'activities',
      timestamps: false,
    });
  
    return Activity;
  };
  