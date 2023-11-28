const sequelize = require('sequelize')
const db = require('../config/db')

const chatmodel = db.define(
    "chat",
    {
        username:{type:sequelize.STRING},
        text:{type:sequelize.STRING},
        file:{type:sequelize.STRING},
        filename:{type:sequelize.STRING}
    }
)

module.exports = chatmodel 