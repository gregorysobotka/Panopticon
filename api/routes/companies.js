var express = require('express');
var router = express.Router();
const { Company, Site, Page, CaptureSpecs } = require('../models/db');

/* GET companies */
router.get('/', async function(req, res, next) {
    try {
        const allCompanies = await Company.findAll();
        res.send(allCompanies);
    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

router.post('/', async function(req, res, next) {
    try {
        const { name } = req.body;
        const companyObject = { name };
        const createCompany = await Company.create(companyObject);
        res.send(createCompany.toJSON());
    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": "error handling request" });
    }
});

// /companies/:companyID/site
router.post('/:companyID/site', async function(req, res, next) {
    
    try {

        const companyID = parseInt(req.params.companyID);
        
        const { url, location, language, environment } = req.body;

        const targetCompany = await Company.findOne({
            where: {
                id: companyID
            }
        });
        
        const newSite = { url, location, language, environment };

        const createdSite = await targetCompany.createSite(newSite);
        
        res.send(createdSite.toJSON());

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

// /companies/companyID/site/siteID
router.post('/:companyID/site/:siteID/pages', async function(req, res, next) {
    
    try {

        const companyID = parseInt(req.params.companyID);
        const siteID = parseInt(req.params.siteID);
        
        const { path } = req.body;

        const targetSite = await Site.findOne({
            where: {
                id: siteID
            }
        });
        
        const newPage = { path };

        const createdPage = await targetSite.createPage(newPage);
        
        res.send(createdPage.toJSON());

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

// /companies/companyID/site/siteID/pages/pageID
router.post('/:companyID/site/:siteID/pages/:pageID', async function(req, res, next) {
    
    try {

        const companyID = parseInt(req.params.companyID);
        const siteID = parseInt(req.params.siteID);
        
        const { path } = req.body;

        const targetSite = await Site.findOne({
            where: {
                id: siteID
            }
        });
        
        const newPage = { path };

        const createdPage = await targetSite.createPage(newPage);
        
        res.send(createdPage.toJSON());

    } catch(e) {
        console.log(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

// 
router.post('/:companyID/site/:siteID/pages/:pageID/specs', async function(req, res, next) {
    
    try {

        const companyID = parseInt(req.params.companyID);
        const siteID = parseInt(req.params.siteID);
        const pageID = parseInt(req.params.pageID);
        
        const { displayname, description, width, height, delay } = req.body;

        const targetPage = await Page.findOne({
            where: {
                id: pageID
            }
        });
        
        const newSpec = { displayname, description, width, height, delay };

        const createdPageCaptureSpec = await targetPage.createCapturespec(newSpec);
        
        res.send(createdPageCaptureSpec.toJSON());

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

// /companies/companyID/site/siteID/pages/pageID
router.get('/:companyID/site/:siteID/pages/:pageID/specs', async function(req, res, next) {
    
    try {

        const companyID = parseInt(req.params.companyID);
        const siteID = parseInt(req.params.siteID);

        const allSitePages = await Page.findAll({
            where: {
                siteId: siteID
            },
            include: CaptureSpecs,
        });
        
        res.send(allSitePages);

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});


module.exports = router;