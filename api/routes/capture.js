var express = require('express');
var router = express.Router();
const { Company, Site, Page, CaptureSpecs, PageCapture, ComparisonHistory } = require('../models/db');
const { screenCapture, captureObj, compareCaptures } = require('../services/capture.js');

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

router.get('/compare/history', async function(req, res, next) {

    try {

        const comparisonHistory = await ComparisonHistory.findAll({
        
        });
    

        res.send(comparisonHistory);

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": "error handling request" });
    }
});

router.post('/compare/history', async function(req, res, next) {

    try {

        const {
            companyid,
            siteid,
            companyname,
            sitename,
            basegroupid,
            compgroupid,
            basecapturetime, 
            compcapturetime,
        } = req.body;

        const allCompanySitePageCaptures = await ComparisonHistory.create({
            companyid,
            siteid,
            companyname,
            sitename,
            basegroupid,
            compgroupid,
            basecapturetime, 
            compcapturetime,
        });
    

        res.send(allCompanySitePageCaptures);

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": "error handling request" });
    }
});

router.get('/image/diff/:imageOne/:imageTwo', async function(req, res, next) {
    try {
        
        const { imageOne, imageTwo } = req.params;

        const result = await compareCaptures(imageOne, imageTwo);
        res.type('png');
        res.send(result);

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": "error handling request" });
    }
});

router.get('/companies/:companyID/sites/:siteID/history', async function(req, res, next) {
    
    const companyID = parseInt(req.params.companyID);
    const siteID = parseInt(req.params.siteID);
    const { groupID } = req.params;

    try {

        const groupConstraints = ['year','month','day', 'hour', 'minute'];

        const allCompanySitePageCaptures = await PageCapture.findAll({

            attributes: ['year', 'month', 'day', 'hour','minute', 'groupid', 'createdAt'],
            where: {
                companyid: companyID,
                siteid: siteID
            },
            group: groupConstraints,
            order: [
                ['createdAt', 'DESC'],
            ]
            
        });
    

        res.send(allCompanySitePageCaptures);

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": "error handling request" });
    }
});

router.get('/history/:groupID', async function(req, res, next) {

    const { groupID } = req.params;

    try {

        const allCompanySitePageCaptures = await PageCapture.findAll({
            where: {
                groupid: groupID
            }
        });
    

        res.send(allCompanySitePageCaptures);

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
    
    const { companyID, siteID, pageID, specID, groupID } = req.body;

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
        
        // Insert record of screenshot capture, adding group id
        captureDetails.groupid = groupID;
        const createPageCaptureEvent = await PageCapture.create(captureDetails);

        res.send(createPageCaptureEvent);

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": "error handling request" });
    }
});

module.exports = router;