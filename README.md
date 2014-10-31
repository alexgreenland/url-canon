# url-canon
url-canon: Express middleware for canonicalisation of URLs with respect to HTTP vs HTTPS and the hostname such as www vs apex. Superfluous trailing slashes in the URL are also removed.

## Installation
This module is a [component](https://github.com/componentjs/component).

    $ component install alexgreenland/url-canon

## Usage
url-canon should be invoked as soon as possible in your middleware stack.
    
Your Express app.
    
    var app = express();
    var urlCanon = require('./components/alexgreenland/url-canon/0.3.0/canon');
    
Canonicalisation options.
Set protocol to "https" to redirect requests on HTTP to the equivalent HTTPS URL. Set protocol to "http" to redirect requests on HTTPS to the equivalent HTTP URL. Set hostname to your canonical hostname.
    
    var canonUrlObject = {
        "protocol": "{http||https}",
        "hostname": "{your hostname}"
    };
    
Options (optional). Default:
    
    var opts = {
        "isProduction": true,
        "proxy": false
    };
    
Invoke the canon middleware with default options.
    
    app.use(urlCanon(hostUrlObject));
    
Invoke the canon middleware with custom options.
    
    app.use(urlCanon(hostUrlObject, opts));
    
## Examples

### Redirect to https://example.org/
This will redirect http://example.org/, http://www.example.org/ and https://www.example.org/ to https://example.org/. https://blog.example.org/ will not be redirected.

    var canonUrlObject = {
        "protocol": "https",
        "hostname": "example.org"
    };

### Redirect to https://www.example.org/
This will redirect http://example.org/, https://example.org/ and http://www.example.org/ to https://www.example.org/. https://blog.example.org/ will not be redirected.

    var canonUrlObject = {
        "protocol": "https",
        "hostname": "www.example.org"
    };
    
## License
Apache License 2.0