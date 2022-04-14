const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error')

const sequelize = require('./util/database'); //this is the path
const Product = require('./models/productModel');
const User = require('./models/userModel');
const Cart = require('./models/cartModel');
const CartItem = require('./models/cart-itemModel');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //need to be static or css wont work

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


let localUser = undefined;
sequelize
  //.sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1)
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Bill', email: 'bill@xxx.yyy' })
    }
    return user;
  })
  .then(user => {
    localUser = user;
    return localUser.getCart();
  })
  .then(cart => {
    if (!cart) {
      // only create if no cart exists
      return localUser.createCart();
    }
    return cart;
  })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

