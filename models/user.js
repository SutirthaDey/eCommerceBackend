// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');


// const User = sequelize.define('user',{
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//     },

//     username: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },

//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     }
// })

const mongodb = require('mongodb');
const {getDb} = require('../util/database');

class User{
    constructor(username,email){
        this.username = username;
        this.email = email;
    }

    insert(){
        const db = getDb();
        return db.collection('users')
        .insertOne(this);
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users')
        .find({_id: new mongodb.ObjectId(userId)})
        .next()
        .then((result)=>{
            return result
        })
        .catch(e=>console.log(e));
    }
}

module.exports = User;