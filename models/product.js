// Replacing with Mongodb

const {getDb} = require('../util/database');
const mongodb = require('mongodb');

class Product{
  constructor(title,price,description,imageUrl,id,userId){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.id = id;
    this.userId = userId;
  }

  save(){
    const db = getDb();
    let dbOps;

    if(this.id){
      dbOps = db.collection('products')
      .updateOne({_id: new mongodb.ObjectId(this.id)},{ $set: this});
    }else{
      dbOps = db.collection('products').insertOne(this);
    }

    return dbOps
      .then(result => {
        console.log(result)
      })
      .catch(err=> {
        console.log(err);
      })
  }

  static deleteById(prodId){
    const db = getDb();

    return db.collection('products')
    .deleteOne({_id: new mongodb.ObjectId(prodId)})
    .then((result)=>{
      console.log('deleted')
    })
    .catch(e=>console.log(e));

  }

  static fetchAll(){
    const db = getDb();
    return db.collection('products')
    .find()
    .toArray()
    .then((products)=>{
      console.log(products);
      return products;
    })
    .catch(err=>console.log(err));
  }

  static count(){
    const db = getDb();
    return db.collection('products')
    .countDocuments()
    .then((result)=>{
      console.log(result);
      return result
    })
    .catch(err=>console.log(err));
  }

  static findById(prodId){
    const db = getDb();
    return db.collection('products')
    .find({_id: new mongodb.ObjectId(prodId)})
    .next()
    .then((result)=>{
      console.log(result);
      return result
    })
    .catch(e=> console.log(e));
  }
}


// Definining model using sequelize

module.exports = Product;