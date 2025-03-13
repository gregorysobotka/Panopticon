var express = require('express');
var router = express.Router();
const { CaptureSpecs } = require('../models/db');

/* GET capture */
router.get('/', async function(req, res, next) {
    try {
        const allSpecs = await CaptureSpecs.findAll();
        res.send(allSpecs);
    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

router.post('/', async function(req, res, next) {
    try {
        const { name, description, width, height, delay } = req.body;
        const specObject = { name, description, width, height, delay };
        const createSpec = await CaptureSpecs.create(specObject);
        res.send(createSpec.toJSON());
    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": "error handling request" });
    }
});


module.exports = router;