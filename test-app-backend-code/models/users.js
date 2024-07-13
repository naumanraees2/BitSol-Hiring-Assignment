

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(50), allowNull: false },
        email: { type: DataTypes.STRING(50), allowNull: false, },
        role: { type: DataTypes.ENUM("admin", "user"), allowNull: false },
        password: { type: DataTypes.STRING(), allowNull: false },
        phone_number: { type: DataTypes.STRING(50) }
    },
        { timestamps: false }
    )

    return User
}