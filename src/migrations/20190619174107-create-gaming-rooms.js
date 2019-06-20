export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('GamingRooms', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    room: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'public'
    },
    members: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('GamingRooms')
};
