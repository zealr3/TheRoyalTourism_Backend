module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define('Food', {
    fid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fdetail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fimg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    did: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'foods',
    timestamps: false,
  });

  Food.associate = (models) => {
    console.log('Associating Food with Destination:', !!models.Destination, typeof models.Destination.findAll);
    Food.belongsTo(models.Destination, {
      foreignKey: 'did',
      as: 'destination',
    });
  };

  console.log('Food model defined:', Food !== undefined, typeof Food.findAll);
  return Food;
};