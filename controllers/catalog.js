module.exports = {
    catalog: async (req, res) => {
        const cubes = await req.storage.getAll(req.query); 
        const ctx = {
            title: 'Cubicle',
            cubes,
            search: req.query.search || '',
            to: req.query.to || '',
            from: req.query.from || ''
        };

        res.render('index', ctx)
    }
}