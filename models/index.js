const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Import models
const Food = require('./food')(sequelize, Sequelize.DataTypes);
const Destination = require('./destination')(sequelize, Sequelize.DataTypes);
const Activity = require('./activity')(sequelize, Sequelize.DataTypes);
const Place = require('./place')(sequelize, Sequelize.DataTypes);

const models = {
  Food,
  Destination,
  Activity,
  Place,
};

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
