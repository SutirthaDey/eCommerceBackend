const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {mongoConnect} = require('./util/database');
const User = require('./models/user');

// const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(cors())

//urlencoded plus json encoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res,next)=>{
    User.findById("631485ea3d82f6d20839c6dc")
    .then((user)=>{
        req.user = user;
        next();
    })
    .catch((err)=>console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// app.use(errorController.get404);

mongoConnect(client=>{
    console.log(client);
    app.listen(3000);
})


