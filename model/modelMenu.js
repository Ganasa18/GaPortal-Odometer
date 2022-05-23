module.exports = (sequelize, Sequelize) => {
  const Menu = sequelize.define("m_menu", {
    menu_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        customValidator(value) {
          if (value === null || value == "") {
            throw new Error("menu name can't be null or empty");
          }
        },
      },
    },
    menu_url: {
      type: Sequelize.STRING(60),
      allowNull: true,
    },
    menu_icon: {
      type: Sequelize.STRING(60),
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  });
  return Menu;
};
