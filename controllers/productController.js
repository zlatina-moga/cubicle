const {Router} = require('express');
const { isAuth } = require('../middlewares/guards');
const router = Router();

router.get('/', async (req, res) => {
    const cubes = await req.storage.getAll(req.query);

    const ctx = {
        title: 'Cubicle',
        cubes,
        search: req.query.search || '',
        from: req.query.from || '',
        to: req.query.to || ''
    }
    res.render('index', ctx)
});

router.get('/create', isAuth(), (req, res) => {
    res.render('create', {title: 'Create cube'})
});

router.post('/create', isAuth(), async (req, res) => {
    const cube = {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        difficulty: Number(req.body.difficulty)
    };

    try {
        await req.storage.create(cube); 
    } catch (err){
        if (err.name == 'ValidationError') {
            return res.render('create', {title: 'Create cube', error: 'All fields are required. Image URL must be a valid URL.'})
        }
    }
    res.redirect('/')
});

router.get('/details/:id', async (req, res) => {
    const id = req.params.id;
    const cube = await req.storage.getById(id);

    if (cube == undefined){
        res.redirect('/404')
    } else {
        res.render('details', cube)
    }
})

router.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const cube = await req.storage.getById(id);
    cube[`select${cube.difficulty}`] = true;

    if (!cube){
        res.redirect('/404')
    } else {
        res.render('edit', cube)
    }
});

router.post('/edit/:id', async (req, res) => {
    const cube = {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        difficulty: Number(req.body.difficulty)
    };
    try {
        await req.storage.edit(req.params.id, cube);
        res.redirect('/')
    } catch(err){
        res.redirect('/404')
    }
})

router.get('/attach/:cubeId', async (req, res) => {
    const cube = await req.storage.getById(req.params.id);
    const accessories = await req.storage.getAllAccessories()
    res.render('attach', {
        title: 'Attach Stickers',
        cube,
        accessories
    })
})

router.post('/attach/:cubeId', async (req, res) => {
    const cubeId = req.params.cubeId;
    const stickerId = req.body.accessory;

    await req.storage.attachSticker(cubeId, stickerId)
    res.redirect(`/details/${cubeId}`)
})

module.exports = router;