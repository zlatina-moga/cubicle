const router = require('express').Router();

router.get('/', (req, res) => res.redirect('/products'));

router.get('/about', (req, res) => {
    res.render('about', {title: 'About Page'})
})

router.all('*', (req, res) => {
    res.render('404', {title: 'Page not found'})
})

module.exports = router;