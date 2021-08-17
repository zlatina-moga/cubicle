const {post: commentPost} = require ('../controllers/comments');

const homeController = require('../controllers/homeController')
const productController = require('../controllers/productController');
const accessoryController = require('../controllers/accessoryController');
const authController = require('../controllers/authController');
const { isAuth } = require('../middlewares/guards');

module.exports = (app) => {
    app.use('/products', productController);
    app.use('/accessory', accessoryController);
    app.use('/auth', authController)

    app.post('/comments/:cubeId/create',isAuth(), commentPost);

    app.use('/', homeController)
}
