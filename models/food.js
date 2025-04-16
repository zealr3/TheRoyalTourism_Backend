module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define('Food', {
    fid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fdetail: {
      type: DataTypes.STRING,
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

  return Food;
};