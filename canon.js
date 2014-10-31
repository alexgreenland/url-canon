/*
 * Copyright 2014 Alex Greenland
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Express middleware for canonicalisation of URLs
// between HTTPS and HTTP and www URLs to non-www (apex) URL equivalents.

var url = require('url');
var extend = require('util')._extend;
var defaultOptions = require('./options');

module.exports = function(canonUrlObject, opts) {
    
    var workingCanonUrlObject = extend(canonUrlObject);
    
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
            var canonProtocol = workingCanonUrlObject.protocol;
            var reqProtocol = req.protocol;
            
            if (options.proxy) {
                reqProtocol = req.get('x-forwarded-proto');
            }
                        
            // Return whether to canonicalise.
            return canonProtocol !== reqProtocol;
        };
        
        var hostnameCanon = function() {
            // Whether the hostname should be canonicalised.
            var canonicalise = false;
            var canonWww = (workingCanonUrlObject.hostname.indexOf('www') === 0);
            
            // req.host from Express returns just the hostname (no port number).
            // See: http://expressjs.com/api.html#req.host
            var reqWww = (req.host.indexOf('www') === 0);
            
            if (!canonWww) {
                canonicalise = (canonWww !== reqWww);
            } else {
                // Canon uses www subdomain.
                // Canonicalise if request is at apex.
                canonicalise = (req.host === workingCanonUrlObject.hostname.substring(4));
            }
            
            // Return whether to canonicalise.
            return canonicalise;            
        };
                        
        if (workingUrl !== originalUrl || (options.isProduction === true && (httpCanon() || hostnameCanon()))) {    
            // Redirect to canon.
            // Compose the expected canonical absolute URL.
            originalUrl = url.format(originalUrlObject);            
            workingCanonUrlObject.pathname = workingUrl;
            workingUrl = url.format(workingCanonUrlObject);
            res.redirect(workingUrl);
            res.end();
        } else {
            next();
        }
        
    };
};