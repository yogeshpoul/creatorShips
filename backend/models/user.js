'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.STRING,
  }, {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Request, { foreignKey: 'fromUserId', as: 'sentRequests' });
    User.hasMany(models.Request, { foreignKey: 'toUserId', as: 'receivedRequests' });
  };

  return User;
};
