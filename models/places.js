module.exports = (sequelize, DataTypes) => {
  const Place = sequelize.define('Place', {
    pl_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pl_detail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pl_best_time: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pl_location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pl_img: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    did: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'places',
    timestamps: false,
  });

  // Debug: Log model definition
  console.log('Place model defined:', !!Place);

  return Place;
};