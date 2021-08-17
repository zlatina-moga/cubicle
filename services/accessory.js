const Accessory = require('../models/Accessory');

async function createAccessory(accessory){
    const record = new Accessory(accessory);
    return record.save();
}

async function getAllAccessories(){
    return Accessory.find({})
}


module.exports = {
    createAccessory,
    getAllAccessories
}