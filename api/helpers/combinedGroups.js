function combineGroupedCaptures(baseCaptureID, compCaptureID, groupedCaptures) {
    
    const groupedHash = {};
    const combinedGroups = [];

    groupedCaptures.forEach((capture) => { 

        const captureType = (capture.groupid == baseCaptureID) ? 'base' : 'comp';
        const ucid = `s${capture.siteid}-p${capture.pageid}-w${capture.width}-h${capture.height}-sid${capture.specid}`;

        if(!groupedHash.hasOwnProperty(ucid)){
            groupedHash[ucid] = { 'base': {}, 'comp': {}, 'imgDelta': '' };
        }

        if(captureType == 'base'){
            groupedHash[ucid].base = capture;
        } else if(captureType == 'comp') {
            groupedHash[ucid].comp = capture;
        }
    });

    Object.keys(groupedHash).forEach((key) => {
        groupedHash[key].imgDelta = `${groupedHash[key].base.filename}/${groupedHash[key].comp.filename}`;
        combinedGroups.push(groupedHash[key]);
    });

    return combinedGroups;
}

module.exports = { combineGroupedCaptures };