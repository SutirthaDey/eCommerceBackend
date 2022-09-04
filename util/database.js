const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;


// added shop into the mongodb connection string
const mongoConnect = (callback)=>{
    MongoClient.connect('mongodb+srv://admin:985168Su@cluster0.kipn65b.mongodb.net/shop?retryWrites=true&w=majority')
    .then((client)=>{
        console.log('connected');
        _db = client.db()
        callback();
    })
    .catch(error=> {
        console.log(error);
        throw error;
    });
}

const getDb = ()=>{
    if(_db){
        return _db;
    }
    throw 'No database found!';
}

module.exports = {
    mongoConnect,
    getDb
}