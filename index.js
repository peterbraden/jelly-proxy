var http = require('http')
  , url = require('url')

var DEFAULTS = {
  tag : "</body>"
, payload : ""
}

module.exports = function createServer(opts, cb, port){

  var deployPayload = function(resp, chunk){
    // modify the html content
    if (resp.headers['content-type'] && resp.headers['content-type'].indexOf("text/html") != -1) {
      var tag = opts.tag || DEFAULTS.tag
        , payload = opts.payload || DEFAULTS.payload
  
      if (typeof(payload) == 'function'){
        payload = payload();
      }
        
      if (chunk.toString().indexOf(tag)){
        chunk = chunk.toString().replace(tag, payload + tag);
      }
    }
    return chunk
  }

  var server  = http.createServer(function (req, res) {
    var ip = req.connection.remoteAddress;
    var uri = url.parse(req.url, true);

    var pathname = uri.search ? uri.pathname + uri.search : uri.pathname;

    if (pathname.indexOf("_jelly") == 0){
      // Special Case URL : Call the callback and let them deal with it...

    } else {
      // Actual proxying happens here
      req.headers['accept-encoding'] = "text/html";  // Stop from requesting gzip

      // allow additional default headers
      var headers={},h;

      for(h in req.headers)
        headers[h]=req.headers[h];

      if(opts.defaultHeaders)
        for(h in opts.defaultHeaders){
          headers[h]=_this.default_headers[h];
        }

       var proxyRequest = http.request({
          port: port
        , hostname: uri.hostname
        , method: req.method
        , path: pathname
        , headers: headers
        }
        , function getProxyRequest(proxyResponse){

          proxyRequest.on("error", function (e) {
            if (!res._header) {
              res.writeHead(502, {})
              res.end();
            } else {
              res.end();
              console.error("[jelly-proxy] client error after writeHead was called. ", e.stack);
            }
          })

          proxyResponse.addListener("data", function (chunk) {
            chunk = deployPayload(proxyResponse, chunk)
            res.write(chunk, 'binary');
          })
          proxyResponse.on("end", function(){
            res.end()
          })
       })
      req.pipe(proxyRequest);
    } // End if _jelly
  }) // End createServer

  return server
}
