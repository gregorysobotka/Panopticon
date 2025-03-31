var express = require('express');
var router = express.Router();
const { Company, Site, Page, CaptureSpecs } = require('../models/db');

router.get('/all', async (req, res) => {

    try {

        const allSitesPageSpecs = await Company.findAll({
            include: {
                model: Site,
                include: {
                    model: Page,
                    include: CaptureSpecs
                }
            }
            
        });

        const backupAt = new Date().toDateString().replace(/\s/g, '-');;

        const fileNameHeader = `attachment; filename="${backupAt}.json"`;
        
        res.setHeader('Content-Disposition', fileNameHeader);
        res.setHeader('Content-Type', 'application/json');
        res.send(allSitesPageSpecs);

    } catch(err) {
        res.sendStatus(404);
    }
});

module.exports = router;