# Jelly Proxy

*NB*: Heavily inspired by jellyproxy.js in the Jellyfish project - hopefully can oneday be used in that project.


Jelly Proxy is a proxy server that allows you to inject a payload onto html pages, allowing you to insert test
monitoring code etc.

## API:

```bash
npm install jelly-proxy
```

```javascript

var jp = require('jelly-proxy')

jp(opts, cb, PORT);

var opts = {
  tag : "</head>" // Default: </body>
, payload : fs.readFileSync("payload.js", "utf8")

}

var cb = function(req, res, next){
}


```
