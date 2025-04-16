module.exports = (sequelize, DataTypes) => {
    const Place = sequelize.define('Place', {
      pl_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pl_detail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pl_best_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pl_location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pl_img: {
        type: DataTypes.STRING,
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
  
    return Place;
  };
  