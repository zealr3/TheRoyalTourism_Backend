module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    aid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    adetail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    alocation: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    aactivity: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    aimg: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    best_time: {
      type: DataTypes.STRING(255),
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