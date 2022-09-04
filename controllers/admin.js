const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing: false
  });
};

exports.getEditProduct = (req,res,next) =>{
  const productId = req.params.productId;
  const editMode = req.query.edit;

  if(!editMode)
   return res.redirect('/');

  Product.findById(productId)
  .then((products)=>{
    console.log(products)
    const product = products;

    res.render('admin/edit-product', {
      product: product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      formsCSS: true,
      editing: editMode
    });
  })
  .catch((err)=>console.log(err));
}

exports.postEditProduct = (req,res,next) =>{
  const prodId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const product = new Product(updatedTitle,updatedPrice,updatedDesc,updatedImageUrl,new mongodb.ObjectId(prodId), req.user._id);

  product
  .save()
  .then((result)=>{
   console.log(result);
   res.redirect('/admin/products')
  })
  .catch(err=>console.log(err));
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title,price,description,imageUrl,null,req.user._id);
  product.save()
  .then((result)=>{
    res.redirect('/admin/products');
    console.log(result);
  })
  .catch((err)=>console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then((products)=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    })
  })
  .catch((err)=> console.log(err));

};

exports.getDeleteProduct = (req,res, next)=>{
  const productId = req.body.id;
  Product.deleteById(productId)
  .then(()=>{
    res.redirect('/admin/products');
  })
  .catch((err)=>console.log(err));
}