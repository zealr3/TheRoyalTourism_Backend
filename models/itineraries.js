module.exports = (sequelize, DataTypes) => {
  const Itineraries = sequelize.define('Itineraries', {
    iid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    iname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    iday1: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iday2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iday3: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iday4: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iday5: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iday6: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iday7: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'itineraries',
    timestamps: false,
  });

  Itineraries.associate = (models) => {
    console.log('Associating Itineraries with TourDetails:', !!models.TourDetails);
    Itineraries.belongsTo(models.TourDetails, {
      foreignKey: 'tid',
      as: 'tourDetails',
    });
  };

  console.log('Itineraries model defined:', !!Itineraries, typeof Itineraries.findAll);
  return Itineraries;
};