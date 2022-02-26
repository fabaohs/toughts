const { Sequelize } = require('sequelize')
require('dotenv/config')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
   host: process.env.DB_HOST,
   dialect: 'mysql'
})

try {
   sequelize.authenticate()
   console.log('Conectado')
} catch (err) {
   if (err) console.log(err)
}

module.exports = sequelize