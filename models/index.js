const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const models = {
  Food: require('./food')(sequelize, Sequelize.DataTypes),
  Destination: require('./destination'),
  Activity: require('./activity')(sequelize, Sequelize.DataTypes),
  Place: require('./places')(sequelize, Sequelize.DataTypes),
  Package: require('./package'),
  TourDetails: require('./tourdetails')(sequelize, Sequelize.DataTypes),
  Itineraries: require('./itineraries')(sequelize, Sequelize.DataTypes),

};

// Define associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    console.log(`Calling associate for ${modelName}`);
    models[modelName].associate(models);
  } else {
    console.log(`No associate function for ${modelName}`);
  }
});

console.log('Models defined:', {
  Food: !!models.Food,
  Destination: !!models.Destination,
  Activity: !!models.Activity,
  Place: !!models.Place,
  Package: !!models.Package,
  TourDetails: !!models.TourDetails,
  Itineraries: !!models.Itineraries,
  User: !!models.User,
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;