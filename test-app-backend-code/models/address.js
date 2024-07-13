module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('address', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.INTEGER }, //F.K from users
        addressLine1: { type: DataTypes.STRING(100), allowNull: false },
        addressLine2: { type: DataTypes.STRING(100), allowNull: true, defaultValue: null },
        city: { type: DataTypes.STRING(50), allowNull: false },
        state: { type: DataTypes.STRING(50), defaultValue: null },
        country: { type: DataTypes.STRING(50), allowNull: false },

    }, { timestamps: false })

    return Address
}