const { chromium } = require("playwright");
const looksSame = require('looks-same');

async function compareCaptures(versionOne, versionTwo){

    const imagesBasePath = '../';

    const imageOne = `${imagesBasePath}${versionOne}`;
    const imageTwo = `${imagesBasePath}${versionTwo}`;
    

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


module.exports = { compareCaptures };