const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const TestModel = mongoose.model('test-model', new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    age: Number
}));

router.get('/test-get', async (req, res) => 
{
    await mongoose.connect('mongodb://localhost:27017/dbname');
    const crocs = await Sighting.find();
    res.end(JSON.stringify(crocs));
});

router.post('/test-post', async (req, res) => 
{
    await mongoose.connect('mongodb://localhost:27017/dbname');
    const crocToRename = await Sighting.findOne({_id: req.body._id});
    crocToRename.name = req.body.name;
    crocToRename.save();
    console.log(crocToRename);
    res.end('ok');
});

module.exports = router;
