var url = require('url');
var extend = require('util')._extend;
var defaultOptions = require('./options');

// Express middleware for canonicalisation of URLs
// between HTTPS and HTTP and www URLs to non-www (apex) URL equivalents.
// Copyright (c) 2014 Alex Greenland. MIT License.
module.exports = function(hostUrlObject, opts) {
    
    var workingHostUrlObject = extend(hostUrlObject);
    
    var options = opts || defaultOptions;
    
    // The canon should be called as early as possible.
    return function(req, res, next) {        
        // req.url from Express returns the relative URL (path) after the hostname.
    
        var workingUrl = req.url;
        
        // Proper original URL, not path.
        var originalUrlObject = {}
        originalUrlObject.protocol = req.protocol;
        originalUrlObject.host = req.host;
        originalUrlObject.pathname = req.url;
        var originalUrl = req.url;
                
        if (options.isProduction) {
            originalUrl = url.format(originalUrlObject);
        }
            
        var slashCanon = function() {
            // Remove all trailing slashes.
            workingUrl = workingUrl.replace(/\/+$/g, '');
            
            if (workingUrl === '') {
                // The root needs a slash!
                // Replace paths of just slashes like '/' and '//' etc. with '/'.
                workingUrl = '/';
            }
        };
        
        slashCanon();
        
        var httpCanon = function() {
            // Whether to use https in the canon.
            var useHttps = (workingHostUrlObject.protocol === 'https');
            var reqProtocol = req.protocol;
            
            if (options.proxy) {
                reqProtocol = req.get('x-forwarded-proto');
            }
            
            // Return whether to canonicalise.
            return useHttps !== reqProtocol;
        };
        
        var wwwCanon = function() {
            // Whether the canon should use the www subdomain.
            var useWww = (workingHostUrlObject.hostname.indexOf('www') === 0);
            
            // req.host from Express returns just the hostname (no port number).
            // See: http://expressjs.com/api.html#req.host
            var reqWww = (req.host.indexOf('www') === 0);
            
            // Return whether to canonicalise.
            return useWww !== reqWww;            
        };
        
        if (options.isProduction) {
            // Running on production.
            var canonicalise = httpCanon() || wwwCanon();
                        
            if (canonicalise) {
                
                // An http or www-based URL, so redirect to apex.
                // Compose the expected canonical absolute URL.            
                workingHostUrlObject.pathname = workingUrl;
            
                workingUrl = url.format(workingHostUrlObject);
                                                
            } else {
                // The URL is already canonical in terms of using HTTPS at the apex.
            }
        
        } else {
            // Running on development.
        }
                        
        if (workingUrl !== originalUrl) {
            res.redirect(workingUrl);
            res.end();
        } else {
            next();
        }
    };
};