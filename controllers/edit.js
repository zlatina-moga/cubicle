module.exports = {
    edit: async (req, res) => {
        const id = req.params.id;
        const cube = await req.storage.getById(id);
        cube[`select${cube.difficulty}`] = true;

        if (!cube){
            res.redirect('/404')
        } else {
            res.render('edit', cube)
        }
    },
    editPost: async (req, res) => {
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
    }
}
