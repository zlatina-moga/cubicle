module.exports = {
    async edit (req, res) {
        const cube = await req.storage.getById(req.params.id);

        if (!cube){
            res.redirect('404')
        } else {
            const ctx = {
                title: 'Edit Cube',
                cube
            }
            res.render('edit', ctx)
        }
        
    },
    post (req, res) {
        res.redirect('/')
    }
}