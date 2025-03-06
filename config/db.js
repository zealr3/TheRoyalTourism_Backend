const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("your_database_name", "your_pgadmin_username", "your_pgadmin_password", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Connected Successfully!");
  } catch (error) {
    console.error("PostgreSQL Connection Error:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
