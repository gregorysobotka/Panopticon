var express = require('express');
var router = express.Router();
const { Company, Site, Page, CaptureSpecs, PageCapture } = require('../models/db');
const { screenCapture, captureObj } = require('../services/capture.js');

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
        const { displayname, description, width, height, delay, browser } = req.body;
        const specObject = { displayname, description, width, height, delay, browser };
        const createSpec = await CaptureSpecs.create(specObject);
        res.send(createSpec.toJSON());
    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": "error handling request" });
    }
});

/*
    Post: /capture/page
    Body: 
    {
        "companyID": Int,
        "siteID": Int,
        "pageID": Int,
        "specID": Int
    }
*/

router.post('/page', async function(req, res, next) {
    
    const { companyID, siteID, pageID, specID } = req.body;

    try {

        const allSitePageSpecs = await Company.findOne({
            where: {
                id: companyID
            },
            include: {
                model: Site,
                where: {
                    id:siteID
                },
                include: {
                    model: Page,
                    where: {
                        id: pageID
                    },
                    include: {
                        model: CaptureSpecs,
                        where: {
                            id: specID
                        }
                    }
                }
            }
            
        });

        const results = allSitePageSpecs.toJSON();
        
        const captureDetails = captureObj(results);
            
        // Generate Screenshot 
        const captureResult = await screenCapture(captureDetails);
        
        // Insert record of screenshot capture
        const createPageCaptureEvent = await PageCapture.create(captureDetails);

        res.send(createPageCaptureEvent);

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": "error handling request" });
    }
});

module.exports = router;