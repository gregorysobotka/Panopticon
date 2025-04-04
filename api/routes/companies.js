var express = require('express');
var router = express.Router();
const { Company, Site, Page, CaptureSpecs } = require('../models/db');
const { Op } = require('sequelize');

const defaultNewPageSpec = { 
    displayname: 'Default', 
    description: 'Default capture spec', 
    width: 1200, 
    height: 1600, 
    delay: 2000 
};

/*
    NOTES: 
    - DO NOT USE `res.status(400).send({ "status": "error", "message": e });` in production. Exposing errors like this provides information that can be used to comprise a site or application.
*/

router.get('/', async function(req, res, next) {
    try {
        const allCompanies = await Company.findAll();
        res.send(allCompanies);
    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

router.get('/:companyID/sites', async function(req, res, next) {
    
    try {

        const companyID = parseInt(req.params.companyID);
        
        const targetSites = await Company.findOne({
            where: {
                id: companyID
            },
            include: Site
        });
        
        res.send(targetSites);

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

router.get('/:companyID/sites/:siteID/pages', async function(req, res, next) {
    
    try {

        const companyID = parseInt(req.params.companyID);
        const siteID = parseInt(req.params.siteID);

        const allSitePages = await Company.findOne({
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
                    include: {
                        model: CaptureSpecs
                    }
                }
            }
            
        });
        
        res.send(allSitePages);

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

router.get('/:companyID/sites/:siteID/pages/:pageID/specs', async function(req, res, next) {
    
    try {

        const companyID = parseInt(req.params.companyID);
        const siteID = parseInt(req.params.siteID);
        const pageID = parseInt(req.params.pageID);
        
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

        res.send(allSitePageSpecs);

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

router.post('/', async function(req, res, next) {
    try {
        const { displayname } = req.body;
        const companyObject = { displayname };
        const createCompany = await Company.create(companyObject);
        res.send(createCompany.toJSON());
    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": "error handling request" });
    }
});

router.post('/:companyID/sites', async function(req, res, next) {
    
    try {

        const companyID = parseInt(req.params.companyID);
        
        const { url, location, language, environment, displayname } = req.body;

        const targetCompany = await Company.findOne({
            where: {
                id: companyID
            }
        });
        
        const newSite = { url, location, language, environment, displayname };

        const createdSite = await targetCompany.createSite(newSite);
        
        res.send(createdSite.toJSON());

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

router.post('/:companyID/sites/:siteID/pages', async function(req, res, next) {
    
    try {

        const companyID = parseInt(req.params.companyID);
        const siteID = parseInt(req.params.siteID);
        
        const { path, displayname } = req.body;

        const targetSite = await Site.findOne({
            where: {
                id: siteID
            }
        });
        
        const newPage = { path, displayname };

        const createdPage = await targetSite.createPage(newPage);
        const createdSpec = await createdPage.createCapturespec(defaultNewPageSpec);

        res.send(createdPage.toJSON());

    } catch(e) {
        console.error(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

router.delete('/:companyID/sites/:siteID/pages/:pageID', async function(req, res, next) {
    
    try {

        // const companyID = parseInt(req.params.companyID);
        // const siteID = parseInt(req.params.siteID);
        const pageID = parseInt(req.params.pageID);

        const removeSite = await Page.destroy({
            where: {
                id: pageID
            }
        });
        
        res.send({ message: `Successfully deleted page with id:${pageID}` });

    } catch(e) {
        console.log(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

// 
router.post('/:companyID/sites/:siteID/pages/:pageID/specs', async function(req, res, next) {
    
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

router.delete('/:companyID/sites/:siteID/pages/:pageID/specs/:specID', async function(req, res, next) {
    
    try {

        // const companyID = parseInt(req.params.companyID);
        // const siteID = parseInt(req.params.siteID);
        // const pageID = parseInt(req.params.pageID);
        const specID = parseInt(req.params.pageID);

        const removeSpec = await CaptureSpecs.destroy({
            where: {
                id: specID
            }
        });
        
        res.send({ message: `Successfully deleted spec with id:${specID}` });

    } catch(e) {
        console.log(e)
        res.status(400).send({ "status": "error", "message": e });
    }
});

module.exports = router;