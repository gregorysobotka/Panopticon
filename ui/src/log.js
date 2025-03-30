import { debug } from 'debug';

// To disable logging, comment out next line
debug.enable('*')

function error(prefix) {
    const debugLabel = (!prefix) ? 'app:error' : `${prefix}:error` ;
    return (content) => debug(debugLabel)(content);
}
function log (prefix) {
    const debugLabel = (!prefix) ? 'app:log' : `${prefix}:log` ;
    return (content) => debug(debugLabel)(content);
}

export { error, log };

/*
    
    Usage

    - log: log('prefix:')('content to be logged...');
    - recommended pattern: prefix = 'dir.file.function:'

    - error: error('prefix:')('error to be logged...');
    - recommended pattern: prefix = 'dir.file.function:'

*/