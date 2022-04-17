const Sequelize = require("sequelize")
const connection = new Sequelize('blog','adm','123',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
})

module.exports = connection