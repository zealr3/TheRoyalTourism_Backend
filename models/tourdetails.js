// models/tourdetails.js
module.exports = (sequelize, DataTypes) => {
  const TourDetails = sequelize.define(
    "TourDetails",
    {
      tid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      tday: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tpickup: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      timg1: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      timg2: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      timg3: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      timg4: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      toverview: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thighlights: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      package_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'packages',
          key: 'id',
        },
      },
    },
    {
      tableName: "tourdetails",
      timestamps: false,
    }
  );

  TourDetails.associate = (models) => {
    TourDetails.hasMany(models.Itineraries, {
      foreignKey: 'tid',
      as: 'itineraries',
    });
    TourDetails.belongsTo(models.Package, {
      foreignKey: 'package_id',
      as: 'package',
    });
  };

  return TourDetails;
};