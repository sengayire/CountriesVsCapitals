export default (sequelize, DataTypes) => {
  const GamingRooms = sequelize.define(
    'GamingRooms',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      room: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'public'
      },
      members: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {}
  );
  GamingRooms.associate = (models) => {};
  return GamingRooms;
};
