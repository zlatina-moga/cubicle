const Cube = require('../models/Cube')

async function init(){
    return (req, res, next) => {
        req.storage = {
            getById,
            getAll,
            create,
            edit
        };
        next();
    };
}

async function getAll(query){
    const options = {};

    if (query.search){
        options.name = {$regex: query.search, $options: 'i'}
    }
    if (query.from){
        options.difficulty = {$gte: Number(query.from)}
    }
    if (query.to){
        options.difficulty = options.difficulty || {};
        options.difficulty.$lte = Number(query.to)
    }
    const cubes = Cube.find(options)
    return cubes;
}

async function getById(id){
    const cube = await Cube.findById(id)

    if (cube){
        return cube;
    } else {
        return undefined;
    }
}

async function create(cube){
    const record = new Cube(cube)
    await record.save()
}

async function edit(id, cube){
    const existing = await Cube.findById(id);

    if (!existing){
        throw new ReferenceError('No such ID in database')
    }
    
    Object.assign(existing, cube);
    return existing.save()
}

module.exports = {
    init,
    getAll,
    getById,
    create
}
