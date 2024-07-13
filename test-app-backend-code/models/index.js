const dbConfig = require('../config/dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.db,
    dbConfig.user,
    dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    logging: false,
    dialectOptions: {
        dateStrings: true,
    },
},
)

sequelize.authenticate()
    .then(() => {
        console.info('Sequelize Db connected successfully...')
    })
    .catch(err => {
        console.log('Error occured in connection:   ' + err)
    })

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

//All Tables here and their associations
db.users = require('./users.js')(sequelize, DataTypes)
db.addresses = require('./address.js')(sequelize, DataTypes)

db.users.hasMany(db.addresses, { foreignKey: "user_id" })
db.addresses.belongsTo(db.users, { foreignKey: "user_id" })


//Re-synchronize after tables associations
db.sequelize.sync()
    .then(async (res) => {
        console.info('yes re.sync done!')
        const data = await db.users.findAll()

        /*------------------Following script will add 10000 records in the db--------------------------- */

        if (data.length < 10000) {
            for (let i = data.length - 1; i < 10000 - data.length; i++) {
                const user = {
                    name: `User${i}`,
                    email: `user${i}@example.com`,
                    role: Math.random() < 0.5 ? 'admin' : 'user',
                    password: '$2a$10$cmf/Mf772kTzjOE89rTgReW.khJQhI2pR4r4z1fL2Dc0/kl.SKFr.', // You should generate a secure password here
                    phone_number: `555-555-${i.toString().padStart(4, '0')}`,
                };

                await db.users.create(user);
            }

            console.log('Inserted 10,000 records successfully.');
        }
    })

    .catch((error) => {
        console.error('Error syncing database:', error);
    });
module.exports = db



