var url = require('url');

module.exports = function (reqUrl, nextCallback, endCallback, redirectCallback) {

    var parsedUrl = url.parse(reqUrl);
    
    if (parsedUrl.protocol.charAt(parsedUrl.protocol.length - 1) === ':') {
        parsedUrl.protocol = parsedUrl.protocol.substring(0, parsedUrl.protocol.length - 1);
    }
    
    // req.url from Express returns the relative URL (path) after the hostname.
    var req = {
        url: parsedUrl.pathname,
        protocol: parsedUrl.protocol,
        host: parsedUrl.host,
        hostname: parsedUrl.hostname
    };
    
    req.get = function(prop) {
        if (prop === 'x-forwarded-proto') {
            return req.protocol;
        } else {
            return undefined;
        }
    };

    var res = {};
    res.redirect = function(url) {
        redirectCallback(url);
    }
    
    var next = nextCallback;
    res.end = endCallback;
    
    return {
        req: req,
        res: res,
        next: next
    };
};