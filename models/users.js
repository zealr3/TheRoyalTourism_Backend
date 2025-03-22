  const { Sequelize, DataTypes } = require("sequelize");
  const sequelize = require("../config/db");

  const User = sequelize.define("User", {  
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true,
      autoIncrement: true 
    },
    fullname: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },
    email: { 
      type: DataTypes.STRING(100), 
      allowNull: false, 
      unique: true 
    },
    pnumber: { 
      type: DataTypes.STRING(15),   // Phone number is optional
      allowNull: true 
    },
    password: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    role: { 
      type: DataTypes.STRING(10), 
      defaultValue: 'user' 
    }
  }, {
    tableName: 'users',  
    timestamps: false    
  });

  module.exports = User;
