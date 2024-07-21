'use strict';
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fromUserId: DataTypes.UUID,
    toUserId: DataTypes.UUID,
    message: DataTypes.TEXT,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
  }, {});

  Request.associate = function(models) {
    Request.belongsTo(models.User, { as: 'fromUser', foreignKey: 'fromUserId' });
    Request.belongsTo(models.User, { as: 'toUser', foreignKey: 'toUserId' });
  };

  return Request;
};
