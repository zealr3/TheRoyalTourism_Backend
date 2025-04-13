const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Destination = require("./destination");

const Package = sequelize.define(
  "Package",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    destinationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Destination,
        key: "did",
      },
    },
  },
  {
    tableName: "packages",
    timestamps: false,
  }
);

Package.belongsTo(Destination, { foreignKey: "destinationId", as: "destination" });
Destination.hasMany(Package, { foreignKey: "destinationId" });

module.exports = Package;