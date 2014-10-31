var assert = require('assert');
var url = require('url');
var extend = require('util')._extend;

// Canonicalisation options
var initialHostUrlObject = {
    "protocol": "https",
    "hostname": "example.org"
};
var initialOptions = require('../options');


describe('canon in apex HTTPS mode', function() {

    it('should redirect a URL of the root from "http" to "https"', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'http://example.org/';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should redirect a URL of the root from "http" to "https" using proxy HTTPS settings', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
        options.proxy = true;
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'http://example.org/';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should redirect a URL of the root from "www" to the apex', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://www.example.org/';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should redirect a URL of the root from "http" to "https" and "www" to the apex', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'http://www.example.org/';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should redirect a URL with a non-root path from "http" to "https"', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'http://example.org/home';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/home'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should redirect a URL with another non-root path from "http" to "https"', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'http://example.org/news/a-story';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/news/a-story'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should redirect a URL with a non-root path and trailing slash from "http" to "https" with trailing slash removed', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'http://example.org/news/a-story/';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/news/a-story'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should remove extra slashes', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://example.org/news/a-story//';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/news/a-story'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should remove extra slashes at the root', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
            
        var options = extend({}, initialOptions);
        
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://example.org//';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should remove extra slashes at the root: 2', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://example.org///';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should redirect "http" to "https" and remove extra slashes', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'http://example.org/news/a-story//';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/news/a-story'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    
    it('should not redirect "https" to "https"', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://example.org/';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/'

        var mockExpress = require('../mock-express')(reqUrl, done, done, function(redirectUrl) {
            assert.fail(redirectUrl, canonUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should not redirect "blog" to apex', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://blog.example.org/';
        
        // Expected canonical URL
        var canonUrl = 'https://blog.example.org/'

        var mockExpress = require('../mock-express')(reqUrl, done, done, function(redirectUrl) {
            assert.fail(redirectUrl, canonUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should not redirect URLs with equal paths: 1', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://example.org/news';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/news'

        var mockExpress = require('../mock-express')(reqUrl, done, done, function(redirectUrl) {
            assert.fail(redirectUrl, canonUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should not redirect URLs with equal paths: 2', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://example.org/news/a-story';
        
        // Expected canonical URL
        var canonUrl = 'https://example.org/news/a-story'

        var mockExpress = require('../mock-express')(reqUrl, done, done, function(redirectUrl) {
            assert.fail(redirectUrl, canonUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    
});

describe('canon in apex HTTP mode', function() {
    
    
    it('should redirect a URL of the root from "https" to "http"', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        hostUrlObject.protocol = 'http';
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://example.org/';
        
        // Expected canonical URL
        var canonUrl = 'http://example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should redirect a URL of the root from "https" and "www" to "http"', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        hostUrlObject.protocol = 'http';
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://www.example.org/';
        
        // Expected canonical URL
        var canonUrl = 'http://example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
});

describe('canon in www HTTPS mode', function() {
    it('should redirect an apex HTTP URL of the root to "www" on HTTPS', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        hostUrlObject.hostname = 'www.' + hostUrlObject.hostname;
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'http://example.org/';
        
        // Expected canonical URL
        var canonUrl = 'https://www.example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should redirect a www HTTP URL of the root to HTTPS', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        hostUrlObject.hostname = 'www.' + hostUrlObject.hostname;
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'http://www.example.org/';
        
        // Expected canonical URL
        var canonUrl = 'https://www.example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should not redirect "blog" to "www"', function(done) {
        var hostUrlObject = extend({}, initialHostUrlObject);
        hostUrlObject.hostname = 'www.' + hostUrlObject.hostname;
        
        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://blog.example.org/';
        
        // Expected canonical URL
        var canonUrl = 'https://blog.example.org/'

        var mockExpress = require('../mock-express')(reqUrl, done, done, function(redirectUrl) {
            assert.fail(redirectUrl, canonUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });

    
});
    
describe('canon in www HTTP mode', function() {
    it('should redirect an apex URL of the root to "www"', function(done) {
        
        var hostUrlObject = extend({}, initialHostUrlObject);
        hostUrlObject.protocol = 'http';
        hostUrlObject.hostname = 'www.' + hostUrlObject.hostname;

        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'http://example.org/';
        
        // Expected canonical URL
        var canonUrl = 'http://www.example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });
    
    it('should redirect an apex HTTPS URL of the root to "www" on HTTP', function(done) {
        
        var hostUrlObject = extend({}, initialHostUrlObject);
        hostUrlObject.protocol = 'http';
        hostUrlObject.hostname = 'www.' + hostUrlObject.hostname;

        var options = extend({}, initialOptions);
            
        var canon = require('../canon')(hostUrlObject, options);
        
        var reqUrl = 'https://example.org/';
        
        // Expected canonical URL
        var canonUrl = 'http://www.example.org/'

        var mockExpress = require('../mock-express')(reqUrl, function() {
            assert.fail(null, null, 'not redirecting');
            done();
        }, function() {
            done();
        }, function(redirectUrl) {
            assert.equal(canonUrl, redirectUrl);
        });

        canon(mockExpress.req, mockExpress.res, mockExpress.next);
    });

    
});



