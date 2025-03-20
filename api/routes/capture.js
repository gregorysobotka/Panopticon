var express = require('express');
var router = express.Router();
const { Company, Site, Page, CaptureSpecs } = require('../models/db');
const { screenCapture } = require('../services/capture.js');
const fs = require('node:fs');
const crypto = require('node:crypto');

/*
    Using the md5 hash of the screen capture URL + timestamp decreases 
    the liklihood of there ever being a naming collision. 
*/

function captureHash(url){
    const urlHashString = `${url}${Date.now()}`;
    return crypto.createHash('md5').update(urlHashString).digest('hex').toString();
}


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

router.post('/page', async function(req, res, next) {
    
    const { companyID, siteID, pageID } = req.body;

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
                    include: CaptureSpecs
                }
            }
            
        });

        const results = allSitePageSpecs.toJSON();
        const siteURL = results.sites[0].url;
        const pagePath = results.sites[0].pages[0].path;
        const fullPageURL = `${siteURL}${pagePath}`;

        const captureSpecs = results.sites[0].pages[0].capturespecs[0]; // supporting 1 size for now

        const filename = captureHash(fullPageURL);
        const filePath = `../capture/${filename}.png`;
    
        const captureObject = {
            url: fullPageURL,
            width: captureSpecs.width,
            delay: captureSpecs.delay,
            filePath
        };
            
        const captureResult = await screenCapture(captureObject);
        console.log(filePath);

        fs.writeFile(filePath, captureResult, err => {
            if (err) {
              console.error(err);
            }
          });

        res.send('');

        // const specObject = { displayname, description, width, height, delay, browser };
        // const createSpec = await CaptureSpecs.create(specObject);
        // res.send(capturedPages);
    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": "error handling request" });
    }
});

module.exports = router;