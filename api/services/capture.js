const { chromium } = require("playwright");
const looksSame = require('looks-same');
const crypto = require('node:crypto');

/*
    Using the md5 hash of the screen capture URL + timestamp decreases 
    the liklihood of there ever being a naming collision. 
*/

function captureHash(strVal){
    const urlHashString = `${strVal}${Date.now()}`;
    return crypto.createHash('md5').update(urlHashString).digest('hex').toString();
}

/*
    captureObject:
    
        {
            url: 'str',
            width: num,
            height: num,
            filePath: 'str'
        }
*/
async function screenCapture(captureObject) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setDefaultTimeout(120000)
    await page.setViewportSize({ width: captureObject.width, height: captureObject.height });
    await page.goto(captureObject.fullurl);
    const screenshot = await page.screenshot({ path: captureObject.imageurl, fullPage: false });
    await page.close();
    await browser.close();
    return screenshot;
};

async function compareCaptures(versionOne, versionTwo){

    const imagesBasePath = '../capture/';
    const imagesDiffPath = '../capture/diff/';

    const imageOne = `${imagesBasePath}${versionOne}`;
    const imageTwo = `${imagesBasePath}${versionTwo}`;

    const hashStringVal = `compare-${Date.now()}`;
    const diffFileName = captureHash(hashStringVal);
    const diffImage = `${imagesDiffPath}${diffFileName}.png`;

    const diffedImages = await looksSame.createDiff({
        reference: imageOne,
        current: imageTwo,
        // diff: diffImage,
        highlightColor: '#ff00ff', // color to highlight the differences
        strict: false, // strict comparsion
        tolerance: 2.5,
        antialiasingTolerance: 0,
        ignoreAntialiasing: true, // ignore antialising by default
        ignoreCaret: true // ignore caret by default
    });

    return diffedImages;
}


// Accepts joined DB Company, Site, Page, Spec Model and produces single object for PageCapture creation  
function captureObj(allSitePageSpecs) {
    
    try {
        const runTime = new Date();

        const site = allSitePageSpecs.sites[0];
        const page = allSitePageSpecs.sites[0].pages[0];
        const fullPageURL = `${site.url}${page.path}`;
        const captureSpec = allSitePageSpecs.sites[0].pages[0].capturespecs[0];
        const filenameHash = captureHash(fullPageURL);
        const filename = `${filenameHash}.png`;

        // Potential refactor. Update DB model to only track file name, storage type (ie. cloud vs disk), storage location (bucket for cloud, path for disk)
        const filePath = `../capture/${filename}`;

        const fullSiteCaptureObject = {
            companyname: allSitePageSpecs.displayname,
            sitename: site.displayname,
            pagename: page.displayname,
            companyid: allSitePageSpecs.id,
            siteid: site.id,
            pageid: page.id,
            fullurl: fullPageURL,
            imageurl: filePath,
            filename: filename,
            location: site.location,
            language: site.language,
            environment: site.environment,
            width: captureSpec.width,
            height: captureSpec.height, 
            delay: captureSpec.delay,
            year: runTime.getFullYear(), 
            month: runTime.getMonth(),
            day: runTime.getDate(),
            hour: runTime.getHours(),
            minute: runTime.getMinutes()
        }

        return fullSiteCaptureObject;

    } catch(e) {
        console.error(e);
        return {};
    }
}

module.exports = { screenCapture, captureObj, compareCaptures };